import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export async function sendMessage(userId: string, message: string) {
  try {
    // Store user message
    await addDoc(collection(db, "chats"), {
      userId,
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Get Gemini response
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // Store assistant message
    await addDoc(collection(db, "chats"), {
      userId,
      role: "assistant",
      content: text,
      timestamp: new Date(),
    });

    return text;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export async function getChatHistory(userId: string) {
  const q = query(
    collection(db, "chats"),
    where("userId", "==", userId),
    orderBy("timestamp", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
