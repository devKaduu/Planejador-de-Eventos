import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, WeekCell } from "../../types";
import { calculateTimeline } from "../../utils/helpers";
import { TaskState } from "./types";
import { Generator } from "../../utils";
import { defaultCategories } from "./mocks";

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: defaultCategories.map((name) => ({
        id: Generator.randomId(),
        name,
        isDefault: true,
      })),
      selectedCategory: null,

      addTask: (task, parentId) =>
        set((state) => {
          const newTask = {
            ...task,
            id: Generator.randomId(),
            subtasks: [],
            parentId: parentId || undefined,
          };

          if (parentId) {
            return {
              tasks: state.tasks.map((t) =>
                t.id === parentId
                  ? { ...t, subtasks: [...(t.subtasks || []), newTask] }
                  : t
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
                  description:
                    updatedTask.description || subtask.description || "",
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
              subtasks:
                task.subtasks?.filter((subtask) => subtask.id !== id) || [],
            })),
        })),

      addCategory: (name) =>
        set((state) => ({
          categories: [...state.categories, { id: Generator.randomId(), name }],
        })),

      deleteCategory: (id) =>
        set((state) => {
          const category = state.categories.find((c) => c.id === id);
          return {
            categories: state.categories.filter((c) => c.id !== id),
            tasks: state.tasks.map((task) =>
              task.category === category?.name
                ? { ...task, category: "" }
                : task
            ),
          };
        }),

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

      resetAll: () =>
        set(() => ({
          tasks: [],
          categories: [],
          selectedCategory: null,
        })),
    }),
    {
      name: "task-storage",
    }
  )
);
