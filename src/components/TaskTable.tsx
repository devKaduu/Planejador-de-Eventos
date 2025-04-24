import React, { useState } from "react";
import { format } from "date-fns";
import { useTaskStore } from "../store/useTaskStore.ts";
import { Task, WeekCell } from "../types";
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from "lucide-react";
import { getMonthName, getStatusColor, getStatusText } from "../utils/helpers";
import { Button } from "./ui/Button";

interface TaskTableProps {
  onEditTask: (task: Task) => void;
  onAddTask: (category?: string, parentId?: string) => void;
  onDeleteCategory?: (id: string) => void;
}

const TaskRow: React.FC<{
  task: Task & { timeline?: WeekCell[] };
  level?: number;
  onEditTask: (task: Task) => void;
  onAddTask: (category: string, parentId: string) => void;
  onDeleteTask: (id: string, e: React.MouseEvent) => void;
}> = ({ task, level = 0, onEditTask, onAddTask, onDeleteTask }) => {
  const [expanded, setExpanded] = useState(true);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <>
      <tr className="hover:bg-gray-50 text-sm md:text-base">
        <td className="px-6 py-3 border min-w-[40px]">{level > 0 && <span style={{ marginLeft: `${level * 20}px` }} />}</td>
        <td className="px-6 py-3 border min-w-[220px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between">
              {hasSubtasks && (
                <button onClick={() => setExpanded(!expanded)} className="mr-2">
                  {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}
              {level === 0 && <div className="font-medium">{task.description}</div>}
            </div>
            <div className="flex space-x-1">
              {level === 0 && (
                <Button variant="ghost" size="sm" onClick={() => onAddTask(task.category, task.id)}>
                  <Plus size={16} />
                </Button>
              )}

              {level === 0 && (
                <button onClick={() => onEditTask(task)} className="text-blue-500 hover:text-blue-700 p-1">
                  <Edit size={16} />
                </button>
              )}
              <button onClick={(e) => onDeleteTask(task.id, e)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </td>
        <td className="px-6 py-3 border min-w-[150px]">{task.responsible}</td>
        <td className="px-6 py-3 border text-center">
          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>{getStatusText(task.status)}</span>
        </td>
        <td className="px-6 py-3 border min-w-[120px]">{task.stage}</td>
        <td className="px-6 py-3 border min-w-[130px]">{format(task.startDate, "dd/MM/yyyy")}</td>
        <td className="px-6 py-3 border min-w-[130px]">{format(task.dueDate, "dd/MM/yyyy")}</td>

        {task.timeline?.map((cell, index, array) => {
          const isLastActive = cell.isActive && (index === array.length - 1 || !array[index + 1]?.isActive);
          return (
            <td
              key={`cell-${task.id}-${cell.month}-${cell.week}`}
              className={`border w-10 p-1  text-black text-lg text-center align-middle ${cell.isActive ? getStatusColor(task.status) : ""}`}
            >
              {isLastActive ? format(task.dueDate, "dd/MM") : "\u00A0"}
            </td>
          );
        })}
      </tr>
      {expanded &&
        task.subtasks?.map((subtask) => (
          <TaskRow key={subtask.id} task={subtask} level={level + 1} onEditTask={onEditTask} onAddTask={onAddTask} onDeleteTask={onDeleteTask} />
        ))}
    </>
  );
};

const TaskTable: React.FC<TaskTableProps> = ({ onEditTask, onAddTask, onDeleteCategory }) => {
  const { categories, deleteTask, getTasksWithTimeline, getTasksByCategory } = useTaskStore();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => Object.fromEntries(categories.map((cat) => [cat.name, true])));

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const monthHeaders = Array.from({ length: 12 }, (_, i) => i + 1).map((month) => ({
    month,
    name: getMonthName(month),
    colSpan: 5,
  }));

  const weekHeaders = Array.from({ length: 12 * 5 }, (_, i) => {
    const month = Math.floor(i / 5) + 1;
    const week = (i % 5) + 1;
    return { month, week, label: `S${week}` };
  });

  const handleDeleteTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse text-sm md:text-base">
        <thead>
          <tr className="bg-[#8d1b55] text-center text-white">
            <th className="px-6 py-3 border border-black text-center min-w-[300px]">CATEGORIA</th>
            <th className="px-6 py-3 border  border-black text-center min-w-[300px]">O QUE</th>
            <th className="px-6 py-3 border  border-black text-center min-w-[150px]">QUEM</th>
            <th className="px-6 py-3 border  border-black text-center min-w-[180px]">STATUS</th>
            <th className="px-6 py-3 border  border-black text-center min-w-[200px]">ETAPA</th>
            <th className="px-6 py-3 border  border-black text-center min-w-[130px]">DATA DE INÍCIO</th>
            <th className="px-6 py-3 border  border-black text-center min-w-[130px]">DATA PREVISTA</th>
            {monthHeaders.map((month) => (
              <th key={`month-${month.month}`} colSpan={month.colSpan} className="px-4 py-2 border border-black text-center bg-[#8d1b55]  text-white">
                {month.name.toUpperCase()}
              </th>
            ))}
          </tr>
          <tr className="bg-[#8d1b55] text-center text-white shadow-2xl ">
            <th colSpan={7}></th>
            {weekHeaders.map((week) => (
              <th
                key={`week-${week.month}-${week.week}`}
                className="w-10 px-2 py-2 border border-black text-center text-xs font-normal bg-[#8d1b55] text-white"
              >
                {week.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const categoryTasks = getTasksByCategory(category.name);
            const isExpanded = expandedCategories[category.name] || false;

            return (
              <React.Fragment key={category.id}>
                <tr className="bg-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => toggleCategory(category.name)}>
                  <td className="px-2 py-3 border font-medium flex items-center justify-between">
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span className="ml-1 text-center ">{category.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        // onAddTask(category.name);
                      }}
                    >
                      {/* <Plus size={16} /> */}
                      <button className="text-red-500 hover:text-red-700 ml-1" onClick={() => onDeleteCategory?.(category.id)}>
                        <Trash2 size={16} />
                      </button>
                    </Button>
                  </td>
                  <td colSpan={6 + 12 * 5} className="px-6 py-3 border text-gray-500">
                    {categoryTasks.length} {categoryTasks.length === 1 ? "Ticket" : "Tickets"}
                  </td>
                </tr>

                {isExpanded &&
                  getTasksWithTimeline()
                    .filter((task) => task.category === category.name)
                    .map((task) => <TaskRow key={task.id} task={task} onEditTask={onEditTask} onAddTask={onAddTask} onDeleteTask={handleDeleteTask} />)}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
