import { useMemo } from "react";
import { TaskFormHeaderProps } from "./props";
import { X } from "lucide-react";

export const TaskFormHeader: React.FC<TaskFormHeaderProps> = ({
  onCancel,
  initialTask,
  parentTask,
}) => {
  const formTitle = useMemo(() => {
    return initialTask
      ? "Editar Tarefa"
      : parentTask
      ? "Nova Subtarefa"
      : "Nova Tarefa";
  }, [initialTask, parentTask]);

  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{formTitle}</h2>
      <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
        <X size={24} />
      </button>
    </div>
  );
};
