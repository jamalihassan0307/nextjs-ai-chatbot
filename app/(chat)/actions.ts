"use server";

import { type CreateMessage, type Message } from "ai";
import { cookies } from "next/headers";

import { model } from "@/lib/ai";
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from "@/lib/db/queries";
import { VisibilityType } from "@/components/visibility-selector";

export async function saveModelId(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("model-id", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: Message;
}) {
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Generate a short title (max 80 chars) summarizing this message: ${message.content}`,
          },
        ],
      },
    ],
  });

  return result.response.text();
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisiblityById({ chatId, visibility });
}
