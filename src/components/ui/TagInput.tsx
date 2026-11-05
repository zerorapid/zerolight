import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Add...',
  className,
}) => {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputVal.trim()) {
      e.preventDefault();
      const trimmed = inputVal.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
      }
      setInputVal('');
    } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        'w-full h-[42px] max-h-[42px] bg-white border border-border-subtle rounded-full px-3 flex items-center gap-1.5 cursor-text transition-all duration-200 overflow-x-auto no-scrollbar flex-nowrap',
        'hover:border-[#94A3B8] focus-within:border-[#0B0F19] focus-within:shadow-[0_0_0_3px_rgba(11,15,25,0.08)]',
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="bg-[var(--brand-tint-90)] text-brand-accessible border border-[var(--brand-tint-70)] rounded-full px-2.5 py-0.5 text-[11px] font-semibold inline-flex items-center gap-1 shrink-0 whitespace-nowrap active:scale-[0.96] transition-transform"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              className="text-brand-accent/70 hover:text-brand-accent cursor-pointer flex items-center active:scale-90 transition-transform"
            >
              <X className="w-3 h-3 stroke-[2.5]" />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>

      <input
        ref={inputRef}
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : 'Add...'}
        className="w-[60px] min-w-[50px] shrink-0 bg-transparent border-none outline-none text-xs font-semibold text-content-main placeholder:text-content-tertiary placeholder:font-normal py-0.5"
      />
    </div>
  );
};
