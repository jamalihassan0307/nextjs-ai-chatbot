"use server";

import { type CreateMessage, type Message } from "ai";
import { cookies } from "next/headers";

import { customModel } from "@/lib/ai";
import {
  deleteMessagesByChatIdAfterTimestamp,
  getMessageById,
  updateChatVisiblityById,
} from "@/lib/db/queries";
import { VisibilityType } from "@/components/visibility-selector";
import { model } from "@/lib/ai/models";

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
        role: "system",
        parts: [
          {
            text: `
          - you will generate a short title based on the first message a user begins a conversation with
          - ensure it is not more than 80 characters long
          - the title should be a summary of the user's message
          - do not use quotes or colons`,
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: JSON.stringify(message) }],
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
