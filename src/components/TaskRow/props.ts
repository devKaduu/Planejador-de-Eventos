import { Task, WeekCell } from "../../types";

export type TaskRowProps = {
  task: Task & { timeline?: WeekCell[] };
  level?: number;
  onEditTask: (task: Task) => void;
  onAddTask: (category: string, parentId: string) => void;
  onDeleteTask: (id: string, e: React.MouseEvent) => void;
};
