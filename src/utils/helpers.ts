import { format, getISOWeek, isSameMonth, isWithinInterval } from "date-fns";
import type { Task, WeekCell } from "../types";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getDefaultCategories = (): string[] => {
  return [
    "PLANEJAMENTO",
    "ORÇAMENTO",
    "COMUNICAÇÃO",
    "VÍDEO",
    "ATIVAÇÕES",
    "MATERIAL GRÁFICO",
    "CENOGRAFIA",
    "PRÉ-EVENTO",
    "EVENTO",
  ];
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Em Criação":
      return "bg-blue-200 text-blue-800";

    case "Aguardando Informação":
      return "bg-yellow-200 text-yellow-800";

    case "Publicada":
      return "bg-pink-200 text-pink-800";

    case "Refação":
      return "bg-red-200 text-red-800";

    case "Aprovado":
      return "bg-green-200 text-green-800";

    case "Aprovado NATURA":
      return "bg-emerald-300 text-emerald-900";

    case "Não iniciado":
      return "bg-gray-300 text-gray-800";

    case "Aguardando Aprovação":
      return "bg-amber-800 text-white";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "pending":
      return "Não Iniciado";
    case "completed":
      return "Finalizado";
    default:
      return status;
  }
};

export const getMonthName = (month: number): string => {
  const date = new Date(2023, month - 1, 1);
  return format(date, "MMM", { locale: undefined }); // Using undefined to default to browser's locale
};

// Calculate timeline cells for a task
export const calculateTimeline = (task: Task): WeekCell[] => {
  const timeline: WeekCell[] = [];

  // Create a matrix of all possible month/week combinations
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

// Helper function to check if a specific week in a month falls within a task's interval
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

// Export table to Excel
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
      headers.push(`${getMonthName(month)} - S${week}`);
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
      status: getStatusText(task.status),
      etapa: task.stage,
      data_de_início: format(task.startDate, "dd/MM/yyyy"),
      data_prevista: format(task.dueDate, "dd/MM/yyyy"),
    };

    // Fill timeline cells
    timeline.forEach((cell) => {
      const key = `${getMonthName(cell.month).toLowerCase()}_s${cell.week}`;
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
