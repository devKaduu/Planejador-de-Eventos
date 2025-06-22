import { Task } from "../../types";

export type CategoryInputProps = {
  parentTask?: Task;
  newCategory: string;
  category: string;
  onChangeNewCategory: (newCategory: string) => void;
  onChangeCategory: (newCategory: string) => void;
  onAddCategory: () => void;
};
