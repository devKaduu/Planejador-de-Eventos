import { Task } from "../../types";

export type TaskFormProps = {
  initialTask?: Task;
  parentTask?: Task;
  onSubmit: (task: Omit<Task, "id">) => void;
  onCancel: () => void;
};
