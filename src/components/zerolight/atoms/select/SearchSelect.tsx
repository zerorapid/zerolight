import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { SearchSelectProps, SelectOption } from './types';
import { DEFAULT_ZEROLIGHT_SETTINGS, calculateInnerRadius } from '../../tokens/settings';
import { SPRING_PRESETS } from '../../tokens/physics';
import { SlidingIndicator } from '../../molecules/SlidingIndicator';

/**
 * ZeroLight SearchSelect Atom
 * Fluid popover select with live filter, kinetic sliding hover backplate, and animated SVG checkmark draw.
 */
export const SearchSelect: React.FC<SearchSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Type to filter...',
  emptyMessage = 'No matching options',
  disabled = false,
  isError = false,
  settings = DEFAULT_ZEROLIGHT_SETTINGS,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [hoverState, setHoverState] = useState({ top: 0, height: 40, opacity: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const filterInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const outerRadius = `${settings.radius}px`;
  const innerRadius = calculateInnerRadius(settings.radius);
  const preset = SPRING_PRESETS[settings.spring];

  // Normalize options to structured objects
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => (typeof opt === 'string' ? { label: opt, value: opt } : opt));
  }, [options]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

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

  // Autofocus filter input on menu open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => filterInputRef.current?.focus(), 50);
    } else {
      setFilterQuery('');
      setHoverState((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [isOpen]);

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(filterQuery.toLowerCase().trim())
  );

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
        className="tactile-press w-full px-4 flex items-center justify-between font-medium outline-none select-none focus:ring-1 focus:ring-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
      >
        <span className="truncate">
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span className="text-neutral-400 font-normal">{placeholder}</span>
          )}
        </span>
        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center ml-2 shrink-0">
          <ChevronDown
            className={`w-3.5 h-3.5 text-neutral-600 transition-transform duration-200 stroke-[2.5] ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Floating Spring Popover Menu */}
      <div
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
        } absolute left-0 right-0 p-2 z-50 flex flex-col gap-1 shadow-floating focus:outline-none`}
      >
        {/* Internal Live Filter Search */}
        <div className="px-1 pt-1 pb-1 relative z-10">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              ref={filterInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              autoComplete="off"
              style={{
                borderColor: settings.borderColor,
                borderWidth: settings.borderWidth === 0 ? '1px' : `${settings.borderWidth}px`,
                color: settings.textColor,
                borderRadius: innerRadius,
              }}
              className="w-full h-9 pl-8 pr-3 text-xs font-medium bg-neutral-100 placeholder:text-neutral-400 outline-none border transition-colors"
            />
          </div>
        </div>

        {/* Option List with Kinetic Sliding Backplate */}
        <ul
          ref={listRef}
          role="listbox"
          onMouseLeave={() => setHoverState((prev) => ({ ...prev, opacity: 0 }))}
          className="relative space-y-0.5 pt-0.5 max-h-56 overflow-y-auto no-scrollbar"
        >
          <SlidingIndicator
            top={hoverState.top}
            height={hoverState.height}
            opacity={hoverState.opacity}
            backgroundColor={settings.backplateColor}
            borderRadius={innerRadius}
          />

          {filteredOptions.length === 0 ? (
            <li className="py-4 text-xs text-center text-neutral-400 select-none">
              {emptyMessage}
            </li>
          ) : (
            filteredOptions.map((opt, idx) => {
              const isSelected = opt.value === value;
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
                  onClick={() => {
                    if (!opt.disabled) {
                      onChange(opt.value);
                      setIsOpen(false);
                    }
                  }}
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
                  <svg
                    className="w-4 h-4 text-neutral-900 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      className="check-path"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

SearchSelect.displayName = 'ZeroLightSearchSelect';

// Aliases
export const ZlSearchSelect = SearchSelect;
export const ZeroSelect = SearchSelect;
export const FluidSearchableSelect = SearchSelect;
