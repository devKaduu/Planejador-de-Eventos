import { PlusCircle } from "lucide-react";
import { InputText } from "../InputText";
import { Label, Select } from "../../Form";
import { Button } from "../../ui/Button";
import { CategoryInputProps } from "./props";
import { useState } from "react";
import { useTaskStore } from "../../../store";

export const CategoryInput: React.FC<CategoryInputProps> = ({
  parentTask,
  newCategory,
  onChangeNewCategory,
  onAddCategory,
  category,
  onChangeCategory,
}) => {
  const [showNewCategory, setShowNewCategory] = useState(false);

  const { categories } = useTaskStore();

  function handleAddCategory(): void {
    setShowNewCategory(false);
    onAddCategory();
  }

  return (
    <div>
      <Label>Categoria</Label>
      {parentTask ? (
        <span className="text-xs text-gray-400">
          Esta categoria é herdada da tarefa principal
        </span>
      ) : showNewCategory ? (
        <div className="flex items-center space-x-2">
          <InputText
            value={newCategory}
            onChange={(e) => onChangeNewCategory(e.target.value ?? "")}
            placeholder="Nova categoria"
          />
          <Button type="button" onClick={handleAddCategory} size="sm">
            Adicionar
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowNewCategory(false)}
          >
            Cancelar
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Select
            value={category}
            onChange={(e) => onChangeCategory(e.target.value)}
            options={categories.map((c) => ({
              value: c.name,
              text: c.name,
            }))}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowNewCategory(true)}
          >
            <PlusCircle size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};
