import React, { useState } from "react";
import { format } from "date-fns";
import { Task, WeekCell } from "../types";
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from "lucide-react";
import { getStatusColor, getStatusText } from "../utils/helpers";
import { Button } from "./ui/Button";

export const TaskRow: React.FC<{
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
        <td className="px-6 py-3 border min-w-[40px]">
          {level > 0 && <span style={{ marginLeft: `${level * 20}px` }} />}
        </td>
        <td className="px-6 py-3 border min-w-[220px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-between">
              {hasSubtasks && (
                <button onClick={() => setExpanded(!expanded)} className="mr-2">
                  {expanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
              {level === 0 && (
                <div className="font-medium">{task.description}</div>
              )}
            </div>
            <div className="flex space-x-1">
              {level === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddTask(task.category, task.id)}
                >
                  <Plus size={16} />
                </Button>
              )}

              {level === 0 && (
                <button
                  onClick={() => onEditTask(task)}
                  className="text-blue-500 hover:text-blue-700 p-1"
                >
                  <Edit size={16} />
                </button>
              )}
              <button
                onClick={(e) => onDeleteTask(task.id, e)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </td>
        <td className="px-6 py-3 border min-w-[150px]">{task.responsible}</td>
        <td className="px-6 py-3 border min-w-[150px]">{task.deadline}</td>
        <td className="px-6 py-3 border min-w-[150px]">{task.commments}</td>
        <td className="px-6 py-3 border min-w-[150px]">{task.documents}</td>
        <td className="px-6 py-3 border text-center">
          <span
            className={`px-2 py-1 rounded text-xs ${getStatusColor(
              task.status
            )}`}
          >
            {getStatusText(task.status)}
          </span>
        </td>
        <td className="px-6 py-3 border min-w-[120px]">{task.stage}</td>
        <td className="px-6 py-3 border min-w-[130px]">
          {format(task.startDate, "dd/MM/yyyy")}
        </td>
        <td className="px-6 py-3 border min-w-[130px]">
          {format(task.dueDate, "dd/MM/yyyy")}
        </td>

        {task.timeline?.map((cell, index, array) => {
          const isLastActive =
            cell.isActive &&
            (index === array.length - 1 || !array[index + 1]?.isActive);
          return (
            <td
              key={`cell-${task.id}-${cell.month}-${cell.week}`}
              className={`border w-10 p-1  text-black text-lg text-center align-middle ${
                cell.isActive ? getStatusColor(task.status) : ""
              }`}
            >
              {isLastActive ? format(task.dueDate, "dd/MM") : "\u00A0"}
            </td>
          );
        })}
      </tr>
      {expanded &&
        task.subtasks?.map((subtask) => (
          <TaskRow
            key={subtask.id}
            task={subtask}
            level={level + 1}
            onEditTask={onEditTask}
            onAddTask={onAddTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
    </>
  );
};
