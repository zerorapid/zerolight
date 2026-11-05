import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { TagSelectProps } from './types';
import { SelectOption } from '../select/types';
import {
  DEFAULT_ZEROLIGHT_SETTINGS,
  calculateInnerRadius,
  calculateTagRadius,
  calculateCheckboxRadius,
} from '../../tokens/settings';
import { SPRING_PRESETS } from '../../tokens/physics';
import { SlidingIndicator } from '../../molecules/SlidingIndicator';

/**
 * ZeroLight TagSelect Atom
 * Dynamic multi-tag selection deck with kinetic inline chips, overflow counter, and custom animated SVG checkboxes.
 */
export const TagSelect: React.FC<TagSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Assign tags...',
  disabled = false,
  isError = false,
  settings = DEFAULT_ZEROLIGHT_SETTINGS,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverState, setHoverState] = useState({ top: 0, height: 40, opacity: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const outerRadius = `${settings.radius}px`;
  const innerRadius = calculateInnerRadius(settings.radius);
  const tagRadius = calculateTagRadius(settings.radius);
  const checkboxRadius = calculateCheckboxRadius(settings.radius);
  const preset = SPRING_PRESETS[settings.spring];

  // Normalize options
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => (typeof opt === 'string' ? { label: opt, value: opt } : opt));
  }, [options]);

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleOption = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const removeFirstTag = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selected.length > 0) {
      onChange(selected.slice(1));
    }
  };

  const count = selected.length;
  const firstTagValue = count > 0 ? selected[0] : null;
  const firstTagLabel =
    normalizedOptions.find((opt) => opt.value === firstTagValue)?.label || firstTagValue;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          backgroundColor: settings.fillColor,
          borderColor: isError ? '#EF4444' : settings.borderColor,
          borderWidth: `${settings.borderWidth}px`,
          color: settings.textColor,
          borderRadius: outerRadius,
          height: `${settings.height}px`,
          fontSize: `${settings.fontSize}px`,
        }}
        className="tactile-press w-full px-4 flex items-center justify-between font-medium outline-none select-none overflow-hidden focus:ring-1 focus:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0 pr-2 overflow-hidden">
          {count === 0 && (
            <span className="text-neutral-400 font-normal truncate">{placeholder}</span>
          )}

          {firstTagLabel && (
            <span
              style={{ borderRadius: tagRadius }}
              className="multi-tag-chip shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium bg-neutral-900 text-white truncate max-w-[170px] chip-animate transition-all"
            >
              <span className="truncate">{firstTagLabel}</span>
              <span
                onClick={removeFirstTag}
                role="button"
                tabIndex={0}
                aria-label={`Remove ${firstTagLabel}`}
                className="btn-remove-tag text-neutral-400 hover:text-white cursor-pointer text-xs font-bold leading-none select-none"
              >
                ×
              </span>
            </span>
          )}

          {count > 1 && (
            <span
              style={{ borderRadius: tagRadius }}
              className="multi-tag-chip shrink-0 px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-300 chip-animate transition-all"
            >
              +{count - 1} more
            </span>
          )}
        </div>

        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center ml-1 shrink-0">
          <ChevronDown
            className={`w-3.5 h-3.5 text-neutral-600 transition-transform duration-200 stroke-[2.5] ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Floating Spring Popover Menu */}
      <ul
        role="listbox"
        aria-multiselectable="true"
        onMouseLeave={() => setHoverState((prev) => ({ ...prev, opacity: 0 }))}
        style={{
          backgroundColor: settings.fillColor,
          borderColor: settings.borderColor,
          borderWidth: `${settings.borderWidth}px`,
          borderRadius: outerRadius,
          marginTop: `${settings.gap}px`,
          transition: isOpen
            ? `opacity 220ms ${preset.cubic}, transform 280ms ${preset.cubic}`
            : 'opacity 140ms cubic-bezier(0.4, 0, 1, 1), transform 140ms cubic-bezier(0.4, 0, 1, 1)',
        }}
        className={`menu-transition ${
          isOpen ? 'menu-visible' : 'menu-hidden'
        } absolute left-0 right-0 p-2 z-50 flex flex-col gap-1 shadow-floating focus:outline-none max-h-60 overflow-y-auto no-scrollbar`}
      >
        <SlidingIndicator
          top={hoverState.top}
          height={hoverState.height}
          opacity={hoverState.opacity}
          backgroundColor={settings.backplateColor}
          borderRadius={innerRadius}
        />

        {normalizedOptions.map((opt, idx) => {
          const isSelected = selected.includes(opt.value);
          return (
            <li
              key={opt.value}
              role="option"
              aria-selected={isSelected}
              data-value={opt.value}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                setHoverState({
                  top: target.offsetTop,
                  height: target.offsetHeight,
                  opacity: 1,
                });
              }}
              onClick={() => !opt.disabled && toggleOption(opt.value)}
              style={{
                borderRadius: innerRadius,
                fontSize: `${settings.fontSize}px`,
                transitionDelay: isOpen ? `${20 + idx * 25}ms` : '0ms',
              }}
              className={`stagger-item h-10 px-3.5 text-sm font-medium cursor-pointer flex items-center justify-between transition-colors select-none ${
                opt.disabled ? 'opacity-40 cursor-not-allowed' : ''
              } ${isSelected ? 'checked text-neutral-900 font-semibold' : 'text-neutral-700'}`}
            >
              <span>{opt.label}</span>
              <div
                style={{
                  borderRadius: checkboxRadius,
                  borderColor: isSelected ? '#111111' : settings.borderColor,
                  backgroundColor: isSelected ? '#111111' : 'transparent',
                  borderWidth: settings.borderWidth === 0 ? '1px' : `${settings.borderWidth}px`,
                }}
                className="w-4 h-4 border flex items-center justify-center transition-all shrink-0"
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    className="check-path"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

TagSelect.displayName = 'ZeroLightTagSelect';

// Aliases
export const ZlTagSelect = TagSelect;
export const ZeroMultiSelect = TagSelect;
export const FluidMultiSelect = TagSelect;
