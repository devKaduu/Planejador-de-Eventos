import { Download, Plus } from "lucide-react";
import React, { useState } from "react";
import Logo from "../assets/logo.jpg"; // Adjust the path as necessary
import { useTaskStore } from "../store/useTaskStore.ts";
import { Task } from "../types";
import { exportToExcel } from "../utils/helpers";
import TaskForm from "./TaskForm";
import { TaskTable } from "./TaskTable";
import { Button } from "./ui/Button";

const Dashboard: React.FC = () => {
  const { tasks, addTask, updateTask, deleteCategory } = useTaskStore();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [parentTaskId, setParentTaskId] = useState<string | undefined>(
    undefined
  );

  const handleShowAddForm = (category?: string, parentId?: string) => {
    setEditingTask(undefined);
    setParentTaskId(parentId);
    if (category) {
      setEditingTask({
        id: "",
        category,
        description: "",
        responsible: "",
        status: "Não Iniciado",
        stage: "",
        startDate: new Date(),
        dueDate: new Date(),
      });
    }
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setParentTaskId(undefined);
    setShowTaskForm(true);
  };

  const handleSubmitTask = (task: Omit<Task, "id">) => {
    if (editingTask?.id) {
      updateTask(editingTask.id, task);
    } else {
      addTask(task, parentTaskId);
    }
    setShowTaskForm(false);
    setEditingTask(undefined);
    setParentTaskId(undefined);
  };

  const handleExportToExcel = () => {
    exportToExcel(tasks);
  };

  const confirmDelete = () => {
    const confirmation = window.confirm("Tem certeza que deseja apagar TUDO?");
    if (!confirmation) return;

    const password = prompt("Digite a senha para confirmar:");
    if (password === "minha-senha-secreta-123") {
      useTaskStore.getState().resetAll(); // <-- você vai criar isso abaixo
      alert("Tudo foi apagado com sucesso.");
    } else {
      alert("Senha incorreta. Nada foi apagado.");
    }
  };

  return (
    <div className="min-h-screen bg-[#effe3c] shadow-2xl shadow-black">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          {/* <h1 className="text-3xl font-bold text-gray-800">CRONO JOY</h1> */}
          <img src={Logo} alt="logo" className="w-20" />
          <div className="flex space-x-3">
            <Button onClick={handleExportToExcel} variant="sucess" disabled>
              <Download size={18} className="mr-2" />
              Exportar Excel
            </Button>
            <Button onClick={() => handleShowAddForm()}>
              <Plus size={18} className="mr-2" />
              Nova Tarefa
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Apagar Tudo
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <TaskTable
            onEditTask={handleEditTask}
            onAddTask={handleShowAddForm}
            onDeleteCategory={deleteCategory}
          />
        </div>

        {showTaskForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <TaskForm
              initialTask={editingTask}
              parentTask={tasks.find((t) => t.id === parentTaskId)}
              onSubmit={handleSubmitTask}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(undefined);
                setParentTaskId(undefined);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
