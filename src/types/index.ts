export interface Task {
  id: string;
  category: string;
  description: string;
  responsible: string;
  deadline: string;
  commments: string;
  documents: string;
  status: TaskStatus;
  stage: string;
  startDate: Date;
  dueDate: Date;
  groupId?: string;
  parentId?: string;
  subtasks?: Task[];
}

export type TaskStatus =
  | "Não Iniciado"
  | "Em Criação"
  | "Finalizado"
  | "Aguardando Informação"
  | "Publicada"
  | "Refação"
  | "Aprovado"
  | "Aguardando Aprovação";

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
