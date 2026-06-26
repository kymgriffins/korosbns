"use client";

import React from "react";
import { cn } from "@/utils";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";

interface CafeChatBubbleProps {
  author: string;
  content: string;
  timestamp: string;
  isMe?: boolean;
  isAdmin?: boolean;
}

export const CafeChatBubble = ({
  author,
  content,
  timestamp,
  isMe,
  isAdmin,
}: CafeChatBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full flex-col gap-1 mb-4",
        isMe ? "items-end" : "items-start"
      )}
    >
      <div className="flex items-center gap-2 px-1">
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider",
          isAdmin ? "text-amber-500" : "text-muted-foreground"
        )}>
          {author} {isAdmin && "• Admin"}
        </span>
        <span className="text-[10px] text-muted-foreground/60">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </span>
      </div>
      
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all",
          isMe
            ? "bg-amber-600 text-white rounded-tr-none"
            : "bg-muted text-foreground ring-1 ring-border/50 rounded-tl-none"
        )}
      >
        <p className="leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </motion.div>
  );
};
