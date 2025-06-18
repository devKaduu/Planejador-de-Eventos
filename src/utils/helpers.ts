import { format, startOfMonth } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { ChannelTag, Task } from "../types";

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

export function getChannelColor(channel: ChannelTag): string {
  switch (channel) {
    case "Whatsapp":
      return "bg-green-200 text-green-800";

    case "Instagram":
      return "bg-red-700 text-white";

    case "Canais Ágeis":
      return "bg-orange-200 text-orange-800";

    case "Tudo":
      return "bg-blue-100 text-blue-800";

    case "E-mail":
      return "bg-yellow-100 text-yellow-800";

    case "Spotify":
      return "bg-gray-200 text-gray-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

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

// Utilitário de nome dos meses em inglês (código usa padrão do seu Excel)
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Timeline generator
export function calculateTimeline(
  task: Task
): { month: number; week: number; isActive: boolean }[] {
  const timeline: any = [];
  const start = new Date(task.startDate);
  const end = new Date(task.dueDate);
  const current = new Date(start);

  while (current <= end) {
    const month = current.getMonth() + 1;
    const day = current.getDate();
    const firstDayOfMonth = startOfMonth(current);
    const week = Math.ceil((day + firstDayOfMonth.getDay()) / 7);

    const exists = timeline.find((t: any) => t.month === month && t.week === week);
    if (!exists) {
      timeline.push({ month, week, isActive: true });
    }

    current.setDate(current.getDate() + 1);
  }

  return timeline;
}

export const exportToExcel = async (tasks: Task[]): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Planejamento de Eventos");

  // Cabeçalhos principais
  const headers = [
    "CATEGORIA",
    "O QUE",
    "QUEM",
    "DEADLINE APROVAÇÃO",
    "COMENTÁRIOS",
    "ARQUIVOS",
    "CANAIS",
    "STATUS",
    "ETAPA",
    "DATA DE INÍCIO",
    "DATA PREVISTA",
  ];

  // Cabeçalhos da timeline
  months.forEach((month) => {
    for (let week = 1; week <= 5; week++) {
      headers.push(`${month} - S${week}`);
    }
  });

  // Define colunas
  worksheet.columns = headers.map((header) => ({
    header,
    key: header.toLowerCase().replace(/\s/g, "_").replace(/[^\w]/g, ""),
    width: header.includes("DATA") ? 15 : header === "O QUE" ? 30 : 20,
  }));

  // Add os dados
  tasks.forEach((task) => {
    const timeline = calculateTimeline(task);

    const row: Record<string, unknown> = {
      categoria: task.category,
      o_que: task.description,
      quem: task.responsible,
      deadline_aprovação: task.deadline,
      comentários: task.commments,
      arquivos: task.documents,
      canais: task.channelTags,
      status: task.status,
      etapa: task.stage,
      data_de_início: format(new Date(task.startDate), "dd/MM/yyyy"),
      data_prevista: format(new Date(task.dueDate), "dd/MM/yyyy"),
    };

    timeline.forEach((cell) => {
      const colKey = `${months[cell.month - 1]} - S${cell.week}`;
      row[colKey.toLowerCase().replace(/ /g, "_")] = "X";
    });

    const addedRow = worksheet.addRow(row);

    // Pintar as células da timeline
    timeline.forEach((cell) => {
      const colKey = `${months[cell.month - 1]} - S${cell.week}`;
      const colIndex = headers.findIndex((h) => h === colKey) + 1;
      const cellRef = addedRow.getCell(colIndex);
      cellRef.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFC0CB" }, // rosa claro
      };
    });
  });

  // Estilizar header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD3D3D3" },
  };

  // Baixar arquivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `planejamento_eventos_${format(new Date(), "dd-MM-yyyy")}.xlsx`);
};
