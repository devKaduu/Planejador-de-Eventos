import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Task, TaskStatus } from "../types";
import { useTaskStore } from "../store/useTaskStore.ts";
import { Button } from "./ui/Button";
import { PlusCircle, X } from "lucide-react";

interface TaskFormProps {
  initialTask?: Task;
  parentTask?: Task;
  onSubmit: (task: Omit<Task, "id">) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialTask, parentTask, onSubmit, onCancel }) => {
  const { categories } = useTaskStore();

  const [category, setCategory] = useState(parentTask?.category || initialTask?.category || categories[0]?.name || "");
  const [description, setDescription] = useState(parentTask?.description || initialTask?.description || "");
  const [responsible, setResponsible] = useState(initialTask?.responsible || "");
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || "Não Iniciado");
  const [stage, setStage] = useState(initialTask?.stage || "");
  const [startDate, setStartDate] = useState<Date>(initialTask?.startDate || new Date());
  const [dueDate, setDueDate] = useState<Date>(initialTask?.dueDate || new Date());
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const addCategory = useTaskStore((state) => state.addCategory);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory("");
      setShowNewCategory(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const task = {
      category,
      description,
      responsible,
      status,
      stage,
      startDate,
      dueDate,
      groupId: initialTask?.groupId,
    };

    onSubmit(task);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{initialTask ? "Editar Tarefa" : parentTask ? "Nova Subtarefa" : "Nova Tarefa"}</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            {parentTask ? (
              <span className="text-xs text-gray-400">Esta categoria é herdada da tarefa principal</span>
            ) : showNewCategory ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nova categoria"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Button type="button" onClick={handleAddCategory} size="sm">
                  Adicionar
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewCategory(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowNewCategory(true)}>
                  <PlusCircle size={18} />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">O que será feito</label>
          {parentTask ? (
            <span className="text-xs text-gray-400">Esta categoria é herdada da tarefa principal</span>
          ) : (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
            <input
              type="text"
              value={responsible}
              onChange={(e) => setResponsible(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Não Iniciado">Não Iniciado</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
            <textarea
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              rows={3}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Prevista</label>
            <DatePicker
              selected={dueDate}
              onChange={(date: Date) => setDueDate(date)}
              minDate={startDate}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">{initialTask ? "Atualizar" : "Adicionar"} Tarefa</Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
