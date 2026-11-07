"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarProps {
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  className?: string;
}

export function Calendar({
  selectedDate = new Date(),
  onSelectDate,
  className = "",
}: CalendarProps) {
  const { tokens, scaled } = useZeroLight();
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledCardRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
      }}
      className={`p-4 border max-w-[280px] w-full select-none space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <span style={{ color: tokens.textIconColor }} className="text-xs font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-neutral-900 cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-neutral-900 cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-neutral-400">
        {dayNames.map((d) => (
          <div key={d} className="py-0.5">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const isSelected =
            selectedDate.getDate() === dayNum &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear();

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => onSelectDate?.(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum))}
              style={{
                borderRadius: `${scaled.scaledPillRadius}px`,
                backgroundColor: isSelected ? tokens.primaryButtonColor : "transparent",
                color: isSelected ? scaled.primaryActionTextColor : tokens.textIconColor,
              }}
              className={`h-7 w-7 flex items-center justify-center font-medium mx-auto cursor-pointer transition-colors tabular-nums ${
                isSelected ? "font-bold shadow-xs" : "hover:bg-neutral-100"
              }`}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
