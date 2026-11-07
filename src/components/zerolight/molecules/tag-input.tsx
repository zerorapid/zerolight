"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { TagChip } from "../atoms/tag-chip";

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  label?: string;
  id?: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Type tag and press Enter...",
  maxTags = 8,
  label,
  id,
}: TagInputProps) {
  const { tokens, scaled } = useZeroLight();
  const [inputVal, setInputVal] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputVal.trim()) {
      e.preventDefault();
      const newTag = inputVal.trim();
      if (!tags.includes(newTag) && tags.length < maxTags) {
        onChange([...tags, newTag]);
        setInputVal("");
      }
    } else if (e.key === "Backspace" && !inputVal && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <label htmlFor={id} style={{ color: tokens.textIconColor }} className="font-medium">
            {label}
          </label>
          <span className="text-neutral-400 font-medium tabular-nums">
            {tags.length}/{maxTags}
          </span>
        </div>
      )}

      <div
        style={{
          borderRadius: `${scaled.scaledRadius}px`,
          borderColor: tokens.universalBorderColor,
          borderWidth: `${tokens.borderWidth}px`,
          backgroundColor: scaled.effectiveInputFill,
          minHeight: `${scaled.scaledHeight}px`,
          padding: "6px 10px",
          transition: scaled.transitionStyle,
        }}
        className="flex flex-wrap items-center gap-1.5 border w-full focus-within:ring-2 focus-within:ring-black/10 transition-colors"
      >
        {tags.map((tag) => (
          <TagChip key={tag} label={tag} onRemove={() => removeTag(tag)} />
        ))}

        {tags.length < maxTags && (
          <input
            id={id}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ""}
            style={{
              fontSize: `${scaled.sublabelFontSize}px`,
              color: tokens.textIconColor,
            }}
            className="flex-1 min-w-[120px] bg-transparent outline-none font-medium placeholder:text-neutral-400 py-1"
          />
        )}
      </div>
    </div>
  );
}
