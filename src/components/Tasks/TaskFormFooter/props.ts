import { Task } from "../../../types";

export type TaskFormFooterProps = {
  initialTask?: Task;
  onCancel: () => void;
};
