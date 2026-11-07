"use client";

import React, { useState, useRef, useEffect } from "react";
import { useZeroLight } from "../context";
import { Avatar } from "../atoms/avatar";
import { TypingIndicator } from "../atoms/typing-indicator";
import { ChatBubble, ChatBubbleProps } from "../molecules/chat-bubble";
import { ChatInput } from "../molecules/chat-input";
import { Phone, Video, Search, MoreHorizontal, Sparkles } from "lucide-react";

export interface ChatConversationProps {
  initialMessages?: Omit<ChatBubbleProps, "onReact" | "onReply" | "onCopy">[];
  peerName?: string;
  peerRole?: string;
  peerAvatar?: string;
  className?: string;
}

const DEFAULT_MESSAGES: Omit<ChatBubbleProps, "onReact" | "onReply" | "onCopy">[] = [
  {
    id: "m1",
    sender: "peer",
    senderName: "Sarah Chen",
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    message: "Hey! Did you check the latest telemetry logs for the us-east-1 production cluster? Latency dropped by 42ms after rolling out the connection pool patch.",
    timestamp: "10:14 AM",
    reactions: [{ emoji: "🚀", count: 3, active: true }],
  },
  {
    id: "m2",
    sender: "user",
    message: "Just pulled the Grafana dashboard. Memory footprint is stable at 38% utilization across all 24 worker nodes.",
    timestamp: "10:16 AM",
    status: "read",
    reactions: [{ emoji: "🙌", count: 2 }],
  },
  {
    id: "m3",
    sender: "peer",
    senderName: "Sarah Chen",
    avatarSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    message: "Here is the compiled benchmark audit export for the platform review meeting this afternoon.",
    timestamp: "10:18 AM",
    attachment: {
      type: "file",
      name: "cluster-benchmarks-v4.2.pdf",
      size: "2.4 MB PDF",
    },
    reactions: [{ emoji: "❤️", count: 1 }],
  },
];

export function ChatConversation({
  initialMessages = DEFAULT_MESSAGES,
  peerName = "Sarah Chen",
  peerRole = "Lead Architect • Cloud Platform",
  peerAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  className = "",
}: ChatConversationProps) {
  const { tokens, scaled } = useZeroLight();
  const [messages, setMessages] = useState(initialMessages);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isPeerTyping]);

  const handleSendMessage = (text: string) => {
    const userMsg: Omit<ChatBubbleProps, "onReact" | "onReply" | "onCopy"> = {
      id: `msg-${Date.now()}`,
      sender: "user",
      message: text,
      timestamp: "Just now",
      status: "delivered",
    };

    setMessages((prev) => [...prev, userMsg]);

    // Simulate realistic intelligent peer response
    setTimeout(() => {
      setIsPeerTyping(true);
    }, 800);

    setTimeout(() => {
      setIsPeerTyping(false);
      const peerMsg: Omit<ChatBubbleProps, "onReact" | "onReply" | "onCopy"> = {
        id: `reply-${Date.now()}`,
        sender: "peer",
        senderName: peerName,
        avatarSrc: peerAvatar,
        message: `Got it! Verified on staging cluster. Let's push to production in the next release window.`,
        timestamp: "Just now",
        reactions: [{ emoji: "✨", count: 1 }],
      };
      setMessages((prev) => [...prev, peerMsg]);
    }, 2400);
  };

  const handleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const existing = m.reactions?.find((r) => r.emoji === emoji);
        let updatedReactions = m.reactions ? [...m.reactions] : [];
        if (existing) {
          updatedReactions = updatedReactions.map((r) =>
            r.emoji === emoji
              ? { ...r, count: r.active ? r.count - 1 : r.count + 1, active: !r.active }
              : r
          ).filter((r) => r.count > 0);
        } else {
          updatedReactions.push({ emoji, count: 1, active: true });
        }
        return { ...m, reactions: updatedReactions };
      })
    );
  };

  return (
    <div
      style={{
        borderRadius: `${scaled.scaledRadius}px`,
        borderColor: tokens.universalBorderColor,
        borderWidth: `${tokens.borderWidth}px`,
        backgroundColor: tokens.universalFillColor,
        transition: scaled.transitionStyle,
      }}
      className={`border shadow-sm flex flex-col h-[520px] w-full overflow-hidden ${className}`}
    >
      {/* ── Thread Header ── */}
      <div
        style={{
          borderColor: tokens.universalBorderColor,
          borderBottomWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
        }}
        className="px-4 py-3 flex items-center justify-between select-none shrink-0 border-b"
      >
        <div className="flex items-center gap-3">
          <Avatar
            src={peerAvatar}
            initials={peerName.slice(0, 2).toUpperCase()}
            size="md"
            status="online"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span
                style={{ fontSize: `${scaled.scaledFontSize}px`, color: tokens.textIconColor }}
                className="font-bold leading-tight"
              >
                {peerName}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
            </div>
            <span
              style={{ fontSize: `${scaled.sublabelFontSize - 1}px` }}
              className="text-neutral-500 font-medium"
            >
              {peerRole}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
            title="Audio call"
          >
            <Phone
              size={scaled.iconSmSize || 16}
              strokeWidth={tokens.iconStrokeWidth || 1.75}
              color={tokens.iconColor || tokens.textIconColor}
            />
          </button>
          <button
            type="button"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
            title="Video call"
          >
            <Video
              size={scaled.iconSmSize || 16}
              strokeWidth={tokens.iconStrokeWidth || 1.75}
              color={tokens.iconColor || tokens.textIconColor}
            />
          </button>
          <button
            type="button"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
            title="Search conversation"
          >
            <Search
              size={scaled.iconSmSize || 16}
              strokeWidth={tokens.iconStrokeWidth || 1.75}
              color={tokens.iconColor || tokens.textIconColor}
            />
          </button>
          <button
            type="button"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
            title="Conversation options"
          >
            <MoreHorizontal
              size={scaled.iconSmSize || 16}
              strokeWidth={tokens.iconStrokeWidth || 1.75}
              color={tokens.iconColor || tokens.textIconColor}
            />
          </button>
        </div>
      </div>

      {/* ── Message Feed ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50"
      >
        {/* Date Divider Pill */}
        <div className="flex items-center justify-center my-1 select-none">
          <span
            style={{
              borderRadius: `${scaled.scaledPillRadius}px`,
              borderColor: tokens.universalBorderColor,
              borderWidth: `${tokens.borderWidth}px`,
              backgroundColor: tokens.universalFillColor,
              fontSize: `${scaled.sublabelFontSize - 1}px`,
            }}
            className="px-3 py-1 font-semibold text-neutral-500 border shadow-2xs tabular-nums"
          >
            Today, Nov 7
          </span>
        </div>

        {/* Message Bubbles */}
        {messages.map((m) => (
          <ChatBubble
            key={m.id}
            {...m}
            onReact={(emoji) => m.id && handleReaction(m.id, emoji)}
          />
        ))}

        {/* Typing Indicator */}
        {isPeerTyping && (
          <div className="flex items-center gap-2 pt-1">
            <Avatar
              src={peerAvatar}
              initials={peerName.slice(0, 2).toUpperCase()}
              size="sm"
            />
            <TypingIndicator label={`${peerName} is typing...`} size="sm" />
          </div>
        )}
      </div>

      {/* ── Thread Composer ── */}
      <div
        style={{
          borderColor: tokens.universalBorderColor,
          borderTopWidth: `${tokens.borderWidth}px`,
          backgroundColor: tokens.universalFillColor,
        }}
        className="p-3 border-t shrink-0"
      >
        <ChatInput
          placeholder={`Reply to ${peerName}...`}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
}
