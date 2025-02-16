"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ChatRequestOptions, CreateMessage, Message } from "ai";
import { memo } from "react";
import { toast } from "sonner";

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "Remember my name is Ali Hassan",
      label: "to ask for the user's permission",
      action: "Remember my name is Ali Hassan",
    },
    {
      title: "Write code to",
      label: `demonstrate djikstra's algorithm`,
      action: `Write code to demonstrate djikstra's algorithm`,
    },
    {
      title: "Help me write an essay",
      label: `about silicon valley`,
      action: `Help me write an essay about silicon valley`,
    },
    {
      title: "What is the weather",
      label: "in San Francisco?",
      action: "What is the weather in San Francisco?",
    },
  ];

  const onClick = async (action: string) => {
    try {
      console.log("[Client] Sending message:", action);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: action }),
      });

      const data = await response.json();
      console.log("[Client] Received response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      window.history.replaceState({}, "", `/chat/${chatId}`);
      append({
        role: "user",
        content: action,
      });
    } catch (error) {
      console.error("[Client] Error:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={() => onClick(suggestedAction.action)}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
