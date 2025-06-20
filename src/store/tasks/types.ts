import { Category, Task, WeekCell } from "../../types";

export type TaskState = {
  tasks: Task[];
  categories: Category[];
  selectedCategory: string | null;

  addTask: (task: Omit<Task, "id">, parentId?: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;

  getTasksWithTimeline: () => (Task & { timeline: WeekCell[] })[];
  getTasksByCategory: (categoryName: string) => Task[];
  resetAll: () => void;
};
