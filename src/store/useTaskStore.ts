import { create } from "zustand";
import { persist } from "zustand/middleware"; // <-- import aqui
import { Category, GroupedTasks, Task, WeekCell } from "../types";
import { calculateTimeline, generateId, getDefaultCategories } from "../utils/helpers";

interface TaskState {
  tasks: Task[];
  categories: Category[];
  selectedCategory: string | null;

  addTask: (task: Omit<Task, "id">, parentId?: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  groupTasks: (taskIds: string[], groupId?: string) => void;
  ungroupTask: (taskId: string) => void;

  getTasksWithTimeline: () => (Task & { timeline: WeekCell[] })[];
  getTasksByCategory: (categoryName: string) => Task[];
  getGroupedTasks: () => GroupedTasks;
  resetAll: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: getDefaultCategories().map((name) => ({
        id: generateId(),
        name,
        isDefault: true,
      })),
      selectedCategory: null,

      addTask: (task, parentId) =>
        set((state) => {
          const newTask = {
            ...task,
            id: generateId(),
            subtasks: [],
            parentId: parentId || undefined,
          };

          if (parentId) {
            return {
              tasks: state.tasks.map((t) =>
                t.id === parentId ? { ...t, subtasks: [...(t.subtasks || []), newTask] } : t
              ),
            };
          }

          return { tasks: [...state.tasks, newTask] };
        }),

      updateTask: (id, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                ...updatedTask,
                subtasks: (task.subtasks || []).map((subtask) => ({
                  ...subtask,
                  category: updatedTask.category || subtask.category || "",
                  description: updatedTask.description || subtask.description || "",
                })),
              };
            }

            if (task.parentId === id) {
              return {
                ...task,
                category: updatedTask.category ?? "",
                description: updatedTask.description ?? "",
              };
            }

            return task;
          }),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks
            .filter((task) => task.id !== id)
            .map((task) => ({
              ...task,
              subtasks: task.subtasks?.filter((subtask) => subtask.id !== id) || [],
            })),
        })),

      addCategory: (name) =>
        set((state) => ({
          categories: [...state.categories, { id: generateId(), name }],
        })),

      deleteCategory: (id) =>
        set((state) => {
          const category = state.categories.find((c) => c.id === id);
          return {
            categories: state.categories.filter((c) => c.id !== id),
            tasks: state.tasks.map((task) =>
              task.category === category?.name ? { ...task, category: "" } : task
            ),
          };
        }),

      setSelectedCategory: (categoryId) =>
        set({
          selectedCategory: categoryId,
        }),

      groupTasks: (taskIds, groupId) => {
        const actualGroupId = groupId || generateId();
        return set((state) => ({
          tasks: state.tasks.map((task) =>
            taskIds.includes(task.id) ? { ...task, groupId: actualGroupId } : task
          ),
        }));
      },

      ungroupTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, groupId: undefined } : task
          ),
        })),

      getTasksWithTimeline: () => {
        const { tasks } = get();
        const processTask = (task: Task): Task & { timeline: WeekCell[] } => ({
          ...task,
          timeline: calculateTimeline(task),
          subtasks: task.subtasks?.map(processTask) || [],
        });
        return tasks.map(processTask);
      },

      getTasksByCategory: (categoryName) => {
        const { tasks } = get();
        return tasks.filter((task) => task.category === categoryName);
      },

      getGroupedTasks: () => {
        const { tasks } = get();
        return tasks.reduce((acc: GroupedTasks, task) => {
          if (task.groupId) {
            if (!acc[task.groupId]) {
              acc[task.groupId] = [];
            }
            acc[task.groupId].push(task);
          }
          return acc;
        }, {});
      },

      resetAll: () =>
        set(() => ({
          tasks: [],
          categories: [],
          selectedCategory: null,
        })),
    }),
    {
      name: "task-storage", // nome no localStorage
    }
  )
);
