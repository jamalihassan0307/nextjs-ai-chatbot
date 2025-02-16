import type {
  Message as AIMessage,
  AssistantMessage as AIAssistantMessage,
} from "ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Message as DBMessage, Document } from "@/lib/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ApplicationError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as ApplicationError;

    error.info = await res.json();
    error.status = res.status;

    throw error;
  }

  return res.json();
};

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

type AssistantMessage = AIAssistantMessage;

function addToolMessageToChat({
  toolMessage,
  messages,
}: {
  toolMessage: ToolMessage;
  messages: Array<ExtendedMessage>;
}): Array<ExtendedMessage> {
  return messages.map((message: ExtendedMessage) => {
    if (message.toolInvocations) {
      return {
        ...message,
        toolInvocations: message.toolInvocations.map(
          (toolInvocation: ToolInvocation) => {
            const toolResult = toolMessage.content.find(
              (tool: { toolCallId: string }) =>
                tool.toolCallId === toolInvocation.toolCallId
            );

            if (toolResult) {
              return {
                ...toolInvocation,
                state: "result",
                result: toolResult.result,
              };
            }

            return toolInvocation;
          }
        ),
      };
    }

    return message;
  });
}

export function convertToUIMessages(
  messages: Array<DBMessage>
): Array<ExtendedMessage> {
  return messages.reduce((chatMessages: Array<ExtendedMessage>, message) => {
    if (message.role === "tool") {
      return addToolMessageToChat({
        toolMessage: message as ToolMessage,
        messages: chatMessages,
      });
    }

    let textContent = "";
    const toolInvocations: Array<ToolInvocation> = [];

    if (typeof message.content === "string") {
      textContent = message.content;
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (content.type === "text") {
          textContent += content.text;
        } else if (content.type === "tool-call") {
          toolInvocations.push({
            state: "call",
            toolCallId: content.toolCallId,
            toolName: content.toolName,
            args: content.args,
          });
        }
      }
    }

    chatMessages.push({
      id: message.id,
      role: message.role as AIMessage["role"],
      content: textContent,
      toolInvocations,
    });

    return chatMessages;
  }, []);
}

type ResponseMessageWithoutId = ToolMessage | AssistantMessage;
type ResponseMessage = ResponseMessageWithoutId & { id: string };

export function sanitizeResponseMessages(
  messages: Array<ResponseMessage>
): Array<ResponseMessage> {
  const toolResultIds: Array<string> = [];

  for (const message of messages) {
    if (message.role === "tool") {
      for (const content of message.content) {
        if (content.type === "tool-result") {
          toolResultIds.push(content.toolCallId);
        }
      }
    }
  }

  const messagesBySanitizedContent = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (typeof message.content === "string") return message;

    const sanitizedContent = message.content.filter(
      (content: {
        type: string;
        toolCallId?: string;
        text?: { value: string };
      }) =>
        content.type === "tool-call"
          ? content.toolCallId !== undefined &&
            toolResultIds.includes(content.toolCallId)
          : content.type === "text"
          ? content.text !== undefined && content.text.value.length > 0
          : true
    );

    return {
      ...message,
      content: sanitizedContent,
    };
  });

  return messagesBySanitizedContent.filter(
    (message) => message.content.length > 0
  );
}

interface ToolMessage {
  role: "tool";
  content: Array<{
    type: "tool-result";
    toolCallId: string;
    result: unknown;
  }>;
}

interface ToolInvocation {
  state: "call" | "result";
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  result?: unknown;
}

interface ExtendedMessage extends AIMessage {
  toolInvocations?: Array<ToolInvocation>;
}

export function sanitizeUIMessages(
  messages: Array<ExtendedMessage>
): Array<ExtendedMessage> {
  const messagesBySanitizedToolInvocations = messages.map((message) => {
    if (message.role !== "assistant") return message;

    if (!message.toolInvocations) return message;

    const toolResultIds: Array<string> = [];

    for (const toolInvocation of message.toolInvocations) {
      if (toolInvocation.state === "result") {
        toolResultIds.push(toolInvocation.toolCallId);
      }
    }

    const sanitizedToolInvocations = message.toolInvocations.filter(
      (toolInvocation) =>
        toolInvocation.state === "result" ||
        toolResultIds.includes(toolInvocation.toolCallId)
    );

    return {
      ...message,
      toolInvocations: sanitizedToolInvocations,
    };
  });

  return messagesBySanitizedToolInvocations.filter(
    (message) =>
      message.content.length > 0 ||
      (message.toolInvocations && message.toolInvocations.length > 0)
  );
}

export function getMostRecentUserMessage(messages: Array<ExtendedMessage>) {
  const userMessages = messages.filter((message) => message.role === "user");
  return userMessages.at(-1);
}

export function getDocumentTimestampByIndex(
  documents: Array<Document>,
  index: number
) {
  if (!documents) return new Date();
  if (index > documents.length) return new Date();

  return documents[index].createdAt;
}
