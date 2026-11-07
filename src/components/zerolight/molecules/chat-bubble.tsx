"use client";

import React, { useState } from "react";
import { useZeroLight } from "../context";
import { Avatar } from "../atoms/avatar";
import { MessageStatus, MessageStatusType } from "../atoms/message-status";
import { Copy, Reply, Smile, Check, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatReaction {
  emoji: string;
  count: number;
  active?: boolean;
}

export interface ChatAttachment {
  type: "file" | "image";
  name: string;
  size?: string;
  url?: string;
}

export interface ChatBubbleProps {
  id?: string;
  message: string;
  sender: "user" | "peer" | "bot";
  senderName?: string;
  avatarSrc?: string;
  avatarInitials?: string;
  timestamp?: string;
  status?: MessageStatusType;
  attachment?: ChatAttachment;
  reactions?: ChatReaction[];
  onReact?: (emoji: string) => void;
  onReply?: () => void;
  onCopy?: () => void;
  className?: string;
}

export function ChatBubble({
  message,
  sender,
  senderName,
  avatarSrc,
  avatarInitials,
  timestamp,
  status = "read",
  attachment,
  reactions = [],
  onReact,
  onReply,
  onCopy,
  className = "",
}: ChatBubbleProps) {
  const { tokens, scaled } = useZeroLight();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = sender === "user";

  const handleCopy = () => {
    navigator.clipboard?.writeText(message);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const bubbleRadius = scaled.scaledRadius === 0 ? 0 : Math.max(8, scaled.scaledRadius);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex gap-2.5 w-full ${isUser ? "justify-end" : "justify-start"} ${className}`}
    >
      {/* Left Avatar for Peer/Bot */}
      {!isUser && (
        <div className="shrink-0 pt-0.5">
          <Avatar
            src={avatarSrc}
            initials={avatarInitials || senderName?.slice(0, 2).toUpperCase() || "AI"}
            size="sm"
            status={sender === "bot" ? "online" : undefined}
          />
        </div>
      )}

      {/* Message Body & Metadata */}
      <div className={`flex flex-col max-w-[82%] sm:max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Sender Name (for peer/bot in group feeds) */}
        {!isUser && senderName && (
          <div className="flex items-center gap-2 mb-1 px-1">
            <span
              style={{ fontSize: `${scaled.sublabelFontSize}px` }}
              className="font-bold text-neutral-800"
            >
              {senderName}
            </span>
            {sender === "bot" && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded">
                BOT
              </span>
            )}
          </div>
        )}

        {/* Bubble Pill with Token Styling */}
        <div
          style={{
            borderRadius: `${bubbleRadius}px`,
            borderBottomRightRadius: isUser ? `${Math.min(4, bubbleRadius)}px` : `${bubbleRadius}px`,
            borderBottomLeftRadius: !isUser ? `${Math.min(4, bubbleRadius)}px` : `${bubbleRadius}px`,
            backgroundColor: isUser ? tokens.primaryButtonColor : tokens.universalFillColor,
            color: isUser ? scaled.primaryActionTextColor : tokens.textIconColor,
            borderColor: isUser ? "transparent" : tokens.universalBorderColor,
            borderWidth: isUser ? 0 : `${tokens.borderWidth}px`,
            fontSize: `${scaled.scaledFontSize}px`,
            transition: scaled.transitionStyle,
          }}
          className={`relative px-4 py-2.5 shadow-2xs leading-relaxed select-text ${
            isUser ? "font-normal" : "border font-normal"
          }`}
        >
          {/* Text Message Content */}
          <div className="whitespace-pre-wrap break-words">{message}</div>

          {/* Optional File Attachment */}
          {attachment && (
            <div
              style={{
                borderRadius: `${Math.max(4, bubbleRadius - 4)}px`,
                backgroundColor: isUser ? "rgba(255, 255, 255, 0.12)" : tokens.hoverBackplateTint,
                borderColor: isUser ? "rgba(255, 255, 255, 0.2)" : tokens.universalBorderColor,
              }}
              className="mt-2.5 p-2 flex items-center gap-2.5 border transition-all"
            >
              <FileText
                size={16}
                strokeWidth={tokens.iconStrokeWidth || 1.75}
                className={isUser ? "text-white" : "text-neutral-600"}
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold truncate leading-tight">
                  {attachment.name}
                </span>
                {attachment.size && (
                  <span
                    style={{ fontSize: `${scaled.sublabelFontSize - 1}px` }}
                    className={isUser ? "text-white/70" : "text-neutral-400"}
                  >
                    {attachment.size}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Timestamp & Message Delivery Status */}
        <div className="flex items-center gap-1.5 mt-1 px-1 select-none">
          {timestamp && (
            <span
              style={{ fontSize: `${scaled.sublabelFontSize - 1}px` }}
              className="text-neutral-400 font-medium tabular-nums"
            >
              {timestamp}
            </span>
          )}
          {isUser && status && (
            <MessageStatus status={status} size={13} />
          )}
        </div>

        {/* Reaction Badges */}
        {reactions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mt-1.5">
            {reactions.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onReact?.(r.emoji)}
                style={{
                  borderRadius: `${scaled.scaledPillRadius}px`,
                  borderColor: r.active ? tokens.primaryButtonColor : tokens.universalBorderColor,
                  borderWidth: `${tokens.borderWidth}px`,
                  backgroundColor: r.active ? tokens.hoverBackplateTint : tokens.universalFillColor,
                }}
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold border cursor-pointer shadow-2xs transition-all hover:scale-105 ${
                  r.active ? "text-neutral-900" : "text-neutral-600"
                }`}
              >
                <span>{r.emoji}</span>
                <span className="tabular-nums text-[11px] font-bold">{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Floating Hover Actions Bar */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ duration: 0.12 }}
            style={{
              borderRadius: `${scaled.scaledPillRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
            className={`absolute top-0 z-20 flex items-center p-0.5 border divide-x divide-neutral-200 select-none ${
              isUser ? "right-[calc(100%-12px)] sm:right-auto sm:left-4" : "left-[calc(100%-12px)] sm:left-auto sm:right-4"
            }`}
          >
            <button
              type="button"
              onClick={() => onReact?.("👍")}
              className="p-1 hover:bg-neutral-100 rounded text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
              title="React with thumbs up"
            >
              <Smile size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />
            </button>
            <button
              type="button"
              onClick={onReply}
              className="p-1 px-1.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
              title="Reply to message"
            >
              <Reply size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 px-1.5 hover:bg-neutral-100 rounded text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors"
              title="Copy message text"
            >
              {copied ? (
                <Check size={13} strokeWidth={2.5} className="text-emerald-600" />
              ) : (
                <Copy size={13} strokeWidth={tokens.iconStrokeWidth || 1.75} />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
