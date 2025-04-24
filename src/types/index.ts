export interface Task {
  id: string;
  category: string;
  description: string;
  responsible: string;
  status: TaskStatus;
  stage: string;
  startDate: Date;
  dueDate: Date;
  groupId?: string;
  parentId?: string;
  subtasks?: Task[];
}

export type TaskStatus = "Não Iniciado" | "Finalizado";

export interface Category {
  id: string;
  name: string;
  isDefault?: boolean;
}

export interface WeekCell {
  month: number;
  week: number;
  isActive: boolean;
}

export interface TaskWithTimeline extends Task {
  timeline: WeekCell[];
}

export interface GroupedTasks {
  [groupId: string]: Task[];
}
