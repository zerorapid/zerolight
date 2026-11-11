"use client";

import React, { createContext, useContext, useId } from "react";
import { useZeroLight } from "../context";
import { AlertCircle } from "lucide-react";

// -------------------------------------------------------------
// Form Context Interfaces
// -------------------------------------------------------------

interface FormItemContextValue {
  id: string;
  name?: string;
  error?: string;
  descriptionId: string;
  messageId: string;
}

const FormItemContext = createContext<FormItemContextValue | null>(null);

export function useFormField() {
  const itemContext = useContext(FormItemContext);
  if (!itemContext) {
    throw new Error("useFormField must be used within a <FormItem>");
  }

  const { id, name, error, descriptionId, messageId } = itemContext;

  return {
    id,
    name,
    formItemId: id,
    formDescriptionId: descriptionId,
    formMessageId: messageId,
    error,
    "aria-describedby": error ? `${descriptionId} ${messageId}` : descriptionId,
    "aria-invalid": Boolean(error),
  };
}

// -------------------------------------------------------------
// Form Root
// -------------------------------------------------------------

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export function Form({ children, className = "", ...props }: FormProps) {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  );
}

// -------------------------------------------------------------
// FormItem
// -------------------------------------------------------------

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  error?: string;
  id?: string;
  children: React.ReactNode;
}

export function FormItem({
  name,
  error,
  id: explicitId,
  children,
  className = "",
  ...props
}: FormItemProps) {
  const generatedId = useId();
  const id = explicitId || `${name || "form-item"}-${generatedId}`;

  const contextValue: FormItemContextValue = {
    id,
    name,
    error,
    descriptionId: `${id}-description`,
    messageId: `${id}-message`,
  };

  return (
    <FormItemContext.Provider value={contextValue}>
      <div className={`space-y-1.5 w-full ${className}`} {...props}>
        {children}
      </div>
    </FormItemContext.Provider>
  );
}

// -------------------------------------------------------------
// FormLabel
// -------------------------------------------------------------

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function FormLabel({ children, className = "", ...props }: FormLabelProps) {
  const { formItemId, error } = useFormField();
  const { tokens, scaled } = useZeroLight();

  return (
    <label
      htmlFor={formItemId}
      style={{
        fontSize: `${scaled.labelFontSize}px`,
        color: error ? "#E11D48" : tokens.textIconColor,
      }}
      className={`block font-medium ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

// -------------------------------------------------------------
// FormControl
// -------------------------------------------------------------

export interface FormControlProps {
  children: React.ReactElement<any>;
}

export function FormControl({ children }: FormControlProps) {
  const { formItemId, formDescriptionId, formMessageId, error } = useFormField();

  return React.cloneElement(children, {
    id: formItemId,
    "aria-describedby": error
      ? `${formDescriptionId} ${formMessageId}`
      : formDescriptionId,
    "aria-invalid": Boolean(error),
    error: Boolean(error),
  });
}

// -------------------------------------------------------------
// FormDescription
// -------------------------------------------------------------

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function FormDescription({ children, className = "", ...props }: FormDescriptionProps) {
  const { formDescriptionId } = useFormField();
  const { scaled } = useZeroLight();

  return (
    <p
      id={formDescriptionId}
      style={{ fontSize: `${scaled.sublabelFontSize}px` }}
      className={`text-neutral-500 leading-normal ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

// -------------------------------------------------------------
// FormMessage
// -------------------------------------------------------------

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export function FormMessage({ children, className = "", ...props }: FormMessageProps) {
  const { formMessageId, error } = useFormField();
  const { tokens, scaled } = useZeroLight();

  const body = children || error;
  if (!body) return null;

  return (
    <div
      id={formMessageId}
      role="alert"
      className={`flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-0.5 ${className}`}
      {...props}
    >
      <AlertCircle
        size={scaled.iconSmSize || 14}
        strokeWidth={tokens.iconStrokeWidth || 1.75}
        className="shrink-0"
      />
      <span>{body}</span>
    </div>
  );
}
