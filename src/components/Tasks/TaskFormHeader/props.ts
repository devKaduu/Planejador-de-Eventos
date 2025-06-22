import { Task } from "../../../types";

export type TaskFormHeaderProps = {
  initialTask?: Task;
  parentTask?: Task;
  onCancel: () => void;
};
