import { Task } from "../../types";

export interface TaskTableProps {
  onEditTask: (task: Task) => void;
  onAddTask: (category?: string, parentId?: string) => void;
  onDeleteCategory?: (id: string) => void;
}
