import { useMemo } from "react";
import { TaskFormFooterProps } from "./props";
import { Button } from "../ui/Button";

export const TaskFormFooter: React.FC<TaskFormFooterProps> = ({
  onCancel,
  initialTask,
}) => {
  const buttonText = useMemo(
    () => (initialTask ? "Atualizar" : "Adicionar"),
    [initialTask]
  );

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">{buttonText} Tarefa</Button>
    </div>
  );
};
