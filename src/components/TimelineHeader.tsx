import React from "react";
import { DateFormatter } from "../utils";

const TimelineHeader: React.FC = () => {
  // Generate month headers for the timeline
  const monthHeaders = Array.from({ length: 12 }, (_, i) => i + 1).map(
    (month) => ({
      month,
      name: DateFormatter.getMonthName(month),
      colSpan: 5, // 5 weeks per month
    })
  );

  // Generate week headers for the timeline
  const weekHeaders = Array.from({ length: 12 * 5 }, (_, i) => {
    const month = Math.floor(i / 5) + 1;
    const week = (i % 5) + 1;
    return { month, week, label: `S${week}` };
  });

  return (
    <div className="flex flex-col border-b">
      <div className="flex">
        {monthHeaders.map((header) => (
          <div
            key={`header-${header.month}`}
            className="flex-1 text-center px-2 py-2 border-r border-t border-b bg-blue-50 font-medium"
            style={{ minWidth: `${header.colSpan * 40}px` }}
          >
            {header.name.toUpperCase()}
          </div>
        ))}
      </div>
      <div className="flex">
        <div className="w-72 px-4 py-1 border-l border-r"></div>
        {weekHeaders.map((week) => (
          <div
            key={`week-${week.month}-${week.week}`}
            className="w-8 text-center text-xs py-1 border-r"
          >
            {week.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineHeader;
