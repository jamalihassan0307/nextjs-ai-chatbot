import { type Message, StreamingTextResponse } from "ai";

import { auth } from "@/app/(auth)/auth";
import { systemPrompt } from "@/lib/ai/prompts";
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from "@/lib/db/queries";
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from "@/lib/utils";

import { generateTitleFromUserMessage } from "../../actions";
import { createDocument } from "@/lib/ai/tools/create-document";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { model } from "@/lib/ai/models";
import { store } from "@/lib/store";
import { deleteChat } from "@/lib/firebase/firestore";

export const maxDuration = 60;

type AllowedTools =
  | "createDocument"
  | "updateDocument"
  | "requestSuggestions"
  | "getWeather";

const blocksTools: AllowedTools[] = [
  "createDocument",
  "updateDocument",
  "requestSuggestions",
];

const weatherTools: AllowedTools[] = ["getWeather"];
const allTools: AllowedTools[] = [...blocksTools, ...weatherTools];

export async function POST(req: Request) {
  const json = await req.json();
  const { messages } = json;
  const session = await auth();

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        ...messages.map((msg: any) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
      ],
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    return new Response(result.response.text());
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const success = await deleteChat(id);
    if (success) {
      return new Response("Chat deleted", { status: 200 });
    } else {
      return new Response("Failed to delete chat", { status: 500 });
    }
  } catch (error) {
    return new Response("An error occurred", { status: 500 });
  }
}
