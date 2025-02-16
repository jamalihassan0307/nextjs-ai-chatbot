import { NextResponse } from "next/server";
import { GeminiService } from "@/lib/services/gemini.service";
import { auth } from "@/lib/firebase";

const geminiService = new GeminiService();

export async function POST(req: Request) {
  try {
    const { message, chatId } = await req.json();
    const user = auth.currentUser;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await geminiService.generateResponse(
      message,
      user.uid,
      chatId
    );

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
