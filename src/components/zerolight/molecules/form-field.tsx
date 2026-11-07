"use client";

import React from "react";
import { useZeroLight } from "../context";
import { Input, InputProps } from "../atoms/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export interface FormFieldProps extends InputProps {
  label: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  id: string;
}

export function FormField({
  label,
  helperText,
  errorMessage,
  successMessage,
  id,
  error,
  ...inputProps
}: FormFieldProps) {
  const { tokens, scaled } = useZeroLight();
  const isError = Boolean(error || errorMessage);

  return (
    <div className="space-y-1.5 w-full">
      <label
        htmlFor={id}
        style={{ fontSize: `${scaled.labelFontSize}px`, color: tokens.textIconColor }}
        className="block font-medium"
      >
        {label}
      </label>

      <Input id={id} error={isError} {...inputProps} />

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!errorMessage && successMessage && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium pt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {!errorMessage && !successMessage && helperText && (
        <p style={{ fontSize: `${scaled.sublabelFontSize}px` }} className="text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
