import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerPopoverProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  value,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const formatted = `${MONTH_NAMES[month].slice(0, 3)} ${day < 10 ? '0' + day : day}, ${year}`;
    onChange(formatted);
    setOpen(false);
  };

  const isSelected = (day: number) => {
    const formatted = `${MONTH_NAMES[month].slice(0, 3)} ${day < 10 ? '0' + day : day}, ${year}`;
    return formatted === value;
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'w-full h-[42px] bg-white rounded-full border border-border-subtle px-4 flex items-center justify-between cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none active:scale-[0.99]',
            'hover:border-[#94A3B8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-visible:border-[#0B0F19] focus-visible:shadow-[0_0_0_3.5px_rgba(11,15,25,0.08),0_4px_16px_rgba(0,0,0,0.04)]',
            open && 'border-[#0B0F19] shadow-[0_0_0_3.5px_rgba(11,15,25,0.08),0_4px_16px_rgba(0,0,0,0.04)]',
            className
          )}
        >
          <span className="text-[13px] font-semibold text-content-main truncate">
            {value || 'Select date'}
          </span>
          <CalendarIcon className="w-3.5 h-3.5 text-content-muted stroke-[2.2] shrink-0" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-[260px] bg-white border border-border-subtle rounded-[18px] p-3 shadow-floating outline-none duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:duration-150 data-[state=closed]:ease-in animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 will-change-[transform,opacity]"
          align="start"
          sideOffset={6}
        >
          <div className="flex items-center justify-between mb-2 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center text-content-muted hover:bg-surface-subtle hover:text-content-main active:scale-90 transition-transform duration-150 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
            <span className="text-xs font-bold text-content-main">
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-7 h-7 rounded-full flex items-center justify-center text-content-muted hover:bg-surface-subtle hover:text-content-main active:scale-90 transition-transform duration-150 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-content-tertiary mb-1">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="w-7 h-7" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const selected = isSelected(day);
              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-150 ease-out select-none active:scale-95 cursor-pointer',
                    selected
                      ? 'bg-brand-accent text-white font-bold shadow-xs scale-105'
                      : 'text-content-main hover:bg-surface-subtle hover:scale-105'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
