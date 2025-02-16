import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, userId, chatId } = await req.json();

    if (!userId || !chatId) {
      return NextResponse.json(
        { error: "Missing userId or chatId" },
        { status: 400 }
      );
    }

    // Store user message
    await addDoc(collection(db, "chats"), {
      userId,
      chatId,
      role: "user",
      content: message,
      timestamp: serverTimestamp(),
    });

    // Get AI response
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Store AI response
    await addDoc(collection(db, "chats"), {
      userId,
      chatId,
      role: "assistant",
      content: text,
      timestamp: serverTimestamp(),
    });

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
