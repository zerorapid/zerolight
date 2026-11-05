import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDown, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  values: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  hasError?: boolean;
  className?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  values,
  onChange,
  placeholder = 'Select options...',
  searchPlaceholder = 'Search tests...',
  hasError = false,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };

  const displayText =
    values.length === 0
      ? placeholder
      : options
          .filter((opt) => values.includes(opt.value))
          .map((opt) => opt.label)
          .join(', ');

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'w-full h-[42px] bg-white rounded-full border border-border-subtle px-3.5 flex items-center justify-between cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none active:scale-[0.99]',
            'hover:border-[#94A3B8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-visible:border-[#0B0F19] focus-visible:shadow-[0_0_0_3.5px_rgba(11,15,25,0.08),0_4px_16px_rgba(0,0,0,0.04)]',
            open && 'border-[#0B0F19] shadow-[0_0_0_3.5px_rgba(11,15,25,0.08),0_4px_16px_rgba(0,0,0,0.04)]',
            hasError && 'border-status-error bg-status-error-tint',
            className
          )}
          title={displayText}
        >
          <span className="text-xs font-semibold text-content-main truncate pr-2 text-left">
            {displayText}
          </span>
          <ChevronDown
            className={cn(
              'w-3.5 h-3.5 text-content-muted transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0 stroke-[2.2]',
              open && 'rotate-180 text-brand-accent'
            )}
          />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 min-w-[260px] max-w-[340px] bg-white border border-border-subtle rounded-[16px] p-2 shadow-floating outline-none duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=closed]:duration-150 data-[state=closed]:ease-in animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 will-change-[transform,opacity]"
          align="start"
          sideOffset={6}
        >
          <div className="flex items-center gap-2 h-9 px-3 bg-surface-subtle border border-transparent focus-within:border-border-subtle focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0B0F19]/10 rounded-full mb-1 transition-all duration-200 ease-out">
            <Search className="w-3.5 h-3.5 text-content-muted stroke-[2.2] shrink-0" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xs font-medium text-content-main placeholder:text-content-tertiary"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5 no-scrollbar">
            {filtered.length === 0 ? (
              <div className="py-3 px-3 text-xs text-content-muted text-center">
                No matching options
              </div>
            ) : (
              filtered.map((opt) => {
                const isSelected = values.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleOption(opt.value)}
                    className={cn(
                      'px-3 py-2 rounded-[10px] text-[13px] font-medium flex items-center justify-between text-left transition-all duration-150 ease-out cursor-pointer active:scale-[0.99]',
                      isSelected
                        ? 'bg-[var(--brand-tint-90)] text-brand-accessible font-semibold'
                        : 'text-content-main hover:bg-surface-subtle hover:translate-x-0.5'
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    <div
                      className={cn(
                        'w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 ml-2 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        isSelected
                          ? 'bg-brand-accent border-brand-accent text-white scale-105'
                          : 'border-border-subtle bg-white'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3] animate-in zoom-in-75 duration-150" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
