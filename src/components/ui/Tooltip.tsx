import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/lib/utils';

export interface SmartTooltipData {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  tag?: string;
  shortcut?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface TooltipProps {
  content: React.ReactNode | SmartTooltipData;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  maxWidth?: number | string;
  disabled?: boolean;
}

export const TooltipProvider = TooltipPrimitive.Provider;

const isSmartData = (c: unknown): c is SmartTooltipData => {
  return (
    c !== null &&
    typeof c === 'object' &&
    !React.isValidElement(c) &&
    ('description' in (c as Record<string, unknown>) || 'title' in (c as Record<string, unknown>))
  );
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'right',
  align = 'center',
  sideOffset = 8,
  maxWidth,
  disabled = false,
}) => {
  if (disabled || !content) {
    return <>{children}</>;
  }

  const isSmart = isSmartData(content);
  // Tier 3 only when rich elements (icon, tag, action) are explicitly present
  const isRichCard = isSmart && Boolean(content.icon || content.tag || content.action);
  // Tier 2 when it's structured title/description without heavy cards
  const isTwoLineMicro = isSmart && !isRichCard;

  return (
    <TooltipPrimitive.Provider delayDuration={120}>
      <TooltipPrimitive.Root delayDuration={120}>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={12}
            style={maxWidth ? { maxWidth } : undefined}
            className={cn(
              'z-[9999] bg-[#101828]/95 backdrop-blur-md text-white border border-white/15 shadow-floating select-none',
              'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2',
              isRichCard
                ? 'rounded-[16px] p-3 max-w-[280px] w-max'
                : isTwoLineMicro
                ? 'rounded-[12px] px-3 py-2 max-w-[230px] w-max'
                : 'rounded-pill px-2.5 py-1 text-xs font-medium max-w-[240px] text-center leading-snug'
            )}
          >
            {isRichCard ? (
              /* Tier 3: Rich Operational Card (Selective & Rare) */
              <div className="flex flex-col gap-1.5 text-left">
                {(content.title || content.icon || content.tag) && (
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {content.icon && (
                        <div className="w-5 h-5 rounded-md bg-white/10 text-[#00a7bc] flex items-center justify-center shrink-0">
                          {content.icon}
                        </div>
                      )}
                      {content.title && (
                        <span className="text-xs font-bold text-white tracking-tight truncate">
                          {content.title}
                        </span>
                      )}
                    </div>
                    {content.tag && (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-white/15 text-white/90 shrink-0">
                        {content.tag}
                      </span>
                    )}
                  </div>
                )}

                {content.description && (
                  <p className="text-[11px] text-white/75 leading-relaxed font-normal">
                    {content.description}
                  </p>
                )}

                {content.action && (
                  <div className="pt-1.5 mt-0.5 border-t border-white/10 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        content.action?.onClick();
                      }}
                      className="h-6 px-2 rounded-lg bg-white/10 hover:bg-[#00a7bc] hover:text-[#101828] active:scale-95 text-[#00a7bc] text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>{content.action.label}</span>
                      <span className="text-xs font-bold">&rarr;</span>
                    </button>
                  </div>
                )}
              </div>
            ) : isTwoLineMicro ? (
              /* Tier 2: Two-Line Smart Microcopy (Standard Workhorse for Sidebar & Table Headers) */
              <div className="flex flex-col gap-0.5 text-left py-0.5">
                {content.title && (
                  <span className="text-xs font-bold text-white tracking-tight leading-tight block">
                    {content.title}
                  </span>
                )}
                {content.description && (
                  <span className="text-[11px] text-white/70 leading-snug font-normal block">
                    {content.description}
                  </span>
                )}
              </div>
            ) : (
              /* Tier 1: Minimalist Label (Single-Line Pill) */
              (content as React.ReactNode)
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
