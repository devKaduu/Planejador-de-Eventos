import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useTaskStore } from "../../store/tasks/useTaskStore.ts";
import { ChannelTag, Task, TaskStatus } from "../../types/index.ts";
import { Button } from "../ui/Button.tsx";
import { TaskFormProps } from "./props.ts";
import { TaskFormHeader } from "../TaskFormHeader/index.tsx";
import { TaskFormFooter } from "../TaskFormFooter/index.tsx";
import { Label } from "../Label/index.tsx";
import { Textarea } from "../Textarea/index.tsx";
import { Datepicker } from "../Datepicker/index.tsx";
import { Select } from "../Select/index.tsx";
import { channelOptions, statusOptions } from "./mocks.ts";
import { InputText } from "../InputText/index.tsx";

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  parentTask,
  onSubmit,
  onCancel,
}) => {
  const { categories } = useTaskStore();

  const [category, setCategory] = useState(
    parentTask?.category || initialTask?.category || categories[0]?.name || ""
  );
  const [description, setDescription] = useState(
    parentTask?.description || initialTask?.description || ""
  );
  const [responsible, setResponsible] = useState(
    initialTask?.responsible || ""
  );
  const [deadline, setDeadLine] = useState("");
  const [commments, setComments] = useState("");
  const [documents, setDocuments] = useState("");
  const [channelTags, setChannelTags] = useState<ChannelTag>(
    initialTask?.channelTags || "Tudo"
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialTask?.status || "Não Iniciado"
  );
  const [stage, setStage] = useState(initialTask?.stage || "");
  const [startDate, setStartDate] = useState<Date>(
    initialTask?.startDate || new Date()
  );
  const [dueDate, setDueDate] = useState<Date>(
    initialTask?.dueDate || new Date()
  );
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
      deadline,
      commments,
      documents,
      channelTags,
      status,
      stage,
      startDate,
      dueDate,
      groupId: initialTask?.groupId,
    } as Task;

    onSubmit(task);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <TaskFormHeader
        onCancel={onCancel}
        initialTask={initialTask}
        parentTask={parentTask}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Categoria</Label>
          {parentTask ? (
            <span className="text-xs text-gray-400">
              Esta categoria é herdada da tarefa principal
            </span>
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
        <div>
          <Label>O que será feito</Label>
          {parentTask ? (
            <span className="text-xs text-gray-400">
              Esta categoria é herdada da tarefa principal
            </span>
          ) : (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Dead Line</Label>
            <InputText
              value={deadline}
              onChange={(e) => setDeadLine(e.target.value ?? "")}
            />
          </div>
          <div>
            <Label>Arquivos</Label>
            <InputText
              value={documents}
              onChange={(e) => setDocuments(e.target.value ?? "")}
            />
          </div>
        </div>

        <div>
          <Label>Comentários</Label>
          <Textarea
            value={commments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Responsável</Label>
            <InputText
              value={responsible}
              onChange={(e) => setResponsible(e.target.value ?? "")}
            />
          </div>
          <div>
            <Label>Canais</Label>
            <Select
              value={channelTags}
              onChange={(e) => setChannelTags(e.target.value as ChannelTag)}
              options={channelOptions}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              options={statusOptions}
            />
          </div>
        </div>
        <div>
          <Label>Etapa</Label>
          <Textarea value={stage} onChange={(e) => setStage(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <Label>Data Início</Label>
            <Datepicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
            />
          </div>
          <div>
            <Label>Data Prevista</Label>
            <Datepicker
              selected={dueDate}
              onChange={(date: Date) => setDueDate(date)}
              minDate={startDate}
            />
          </div>
        </div>
        <TaskFormFooter onCancel={onCancel} initialTask={initialTask} />
      </form>
    </div>
  );
};
