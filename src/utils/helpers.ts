import { format, getISOWeek, isSameMonth, isWithinInterval } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { Task, WeekCell } from "../types";
import { TaskRowUtils } from "../components/TaskRow/utils";
import { DateFormatter } from "./date-formatter";

export const calculateTimeline = (task: Task): WeekCell[] => {
  const timeline: WeekCell[] = [];

  for (let month = 1; month <= 12; month++) {
    for (let week = 1; week <= 5; week++) {
      // Assume the cell is not active by default
      const isActive = isWeekInTaskInterval(
        month,
        week,
        task.startDate,
        task.dueDate
      );

      timeline.push({
        month,
        week,
        isActive,
      });
    }
  }

  return timeline;
};

const isWeekInTaskInterval = (
  month: number,
  week: number,
  startDate: Date,
  dueDate: Date
): boolean => {
  // This is a simplified approach - in a real implementation, you would need to calculate
  // the actual date ranges for each week in each month
  const year = new Date().getFullYear();

  // Create a mock date for this week and month (this is simplified)
  // In a real implementation, you would need to calculate the first day of the given week in the month
  const weekStartDay = (week - 1) * 7 + 1;
  const mockWeekDate = new Date(year, month - 1, Math.min(weekStartDay, 28));

  // Check if this mock date is within the task's interval
  return (
    isWithinInterval(mockWeekDate, { start: startDate, end: dueDate }) ||
    (isSameMonth(mockWeekDate, startDate) &&
      getISOWeek(mockWeekDate) === getISOWeek(startDate)) ||
    (isSameMonth(mockWeekDate, dueDate) &&
      getISOWeek(mockWeekDate) === getISOWeek(dueDate))
  );
};

export const exportToExcel = async (tasks: Task[]): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Planejamento de Eventos");

  // Set column headers
  const headers = [
    "CATEGORIA",
    "O QUE",
    "QUEM",
    "STATUS",
    "ETAPA",
    "DATA DE INÍCIO",
    "DATA PREVISTA",
  ];

  // Add month/week headers
  for (let month = 1; month <= 12; month++) {
    for (let week = 1; week <= 5; week++) {
      headers.push(`${DateFormatter.getMonthName(month)} - S${week}`);
    }
  }

  worksheet.columns = headers.map((header) => ({
    header,
    key: header.toLowerCase().replace(/\s/g, "_").replace(/[^\w]/g, ""),
    width: header.includes("DATA") ? 15 : header === "O QUE" ? 30 : 12,
  }));

  // Add data
  tasks.forEach((task) => {
    const timeline = calculateTimeline(task);
    const row: Record<string, unknown> = {
      categoria: task.category,
      o_que: task.description,
      quem: task.responsible,
      status: TaskRowUtils.getStatusText(task.status),
      etapa: task.stage,
      data_de_início: format(task.startDate, "dd/MM/yyyy"),
      data_prevista: format(task.dueDate, "dd/MM/yyyy"),
    };

    // Fill timeline cells
    timeline.forEach((cell) => {
      const key = `${DateFormatter.getMonthName(cell.month).toLowerCase()}_s${
        cell.week
      }`;
      row[key] = cell.isActive ? "X" : "";
    });

    worksheet.addRow(row);
  });

  // Apply styles
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD3D3D3" },
  };

  // Create buffer and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `planejamento_eventos_${format(new Date(), "dd-MM-yyyy")}.xlsx`);
};
