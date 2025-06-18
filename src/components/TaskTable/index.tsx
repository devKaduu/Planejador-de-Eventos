import React, { useMemo, useState } from "react";
import { useTaskStore } from "../../store/useTaskStore.ts";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { getMonthName } from "../../utils/helpers";
import { Button } from "../ui/Button";
import { TaskRow } from "../TaskRow.tsx";
import { TableHeaderItem } from "../TableHeaderItem.tsx";
import { TaskTableProps } from "./props.ts";
import { mockTableHeader } from "./mock.ts";

export const TaskTable: React.FC<TaskTableProps> = ({
  onEditTask,
  onAddTask,
  onDeleteCategory,
}) => {
  const { categories, deleteTask, getTasksWithTimeline, getTasksByCategory } =
    useTaskStore();
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => Object.fromEntries(categories.map((cat) => [cat.name, true])));

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const monthHeaders = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => i + 1).map((month) => ({
        month,
        name: getMonthName(month),
        colSpan: 5,
      })),
    []
  );

  const weekHeaders = useMemo(
    () =>
      Array.from({ length: 12 * 5 }, (_, i) => {
        const month = Math.floor(i / 5) + 1;
        const week = (i % 5) + 1;
        return { month, week, label: `S${week}` };
      }),
    []
  );

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
            {mockTableHeader.map((header, index) => (
              <TableHeaderItem key={index} text={header} />
            ))}
            {monthHeaders.map((month) => (
              <th
                key={`month-${month.month}`}
                colSpan={month.colSpan}
                className="px-4 py-2 border border-black text-center bg-[#8d1b55]  text-white"
              >
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
                <tr
                  className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleCategory(category.name)}
                >
                  <td className="px-2 py-3 border font-medium flex items-center justify-between">
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                    <span className="ml-1 text-center ">{category.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <button
                        className="text-red-500 hover:text-red-700 ml-1"
                        onClick={() => onDeleteCategory?.(category.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </Button>
                  </td>
                  <td
                    colSpan={6 + 12 * 5}
                    className="px-6 py-3 border text-gray-500"
                  >
                    {categoryTasks.length}{" "}
                    {categoryTasks.length === 1 ? "Ticket" : "Tickets"}
                  </td>
                </tr>

                {isExpanded &&
                  getTasksWithTimeline()
                    .filter((task) => task.category === category.name)
                    .map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onEditTask={onEditTask}
                        onAddTask={onAddTask}
                        onDeleteTask={handleDeleteTask}
                      />
                    ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
