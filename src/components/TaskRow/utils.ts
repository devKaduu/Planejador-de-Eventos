import { ChannelTag, TaskStatus } from "../../types";

export class TaskRowUtils {
  static getStatusColor(status: TaskStatus): string {
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

      case "Finalizado":
        return "bg-emerald-300 text-emerald-900";

      case "Não Iniciado":
        return "bg-gray-300 text-gray-800";

      case "Aguardando Aprovação":
        return "bg-amber-800 text-white";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  static getStatusText(status: string): string {
    switch (status) {
      case "pending":
        return "Não Iniciado";
      case "completed":
        return "Finalizado";
      default:
        return status;
    }
  }

  static getChannelColor(channel: ChannelTag): string {
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
}
