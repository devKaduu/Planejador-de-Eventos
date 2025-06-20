import { ChannelTag } from "./channel-tag";
import { TaskStatus } from "./task-status";

export type Task = {
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
  channelTags: ChannelTag;
  subtasks?: Task[];
};
