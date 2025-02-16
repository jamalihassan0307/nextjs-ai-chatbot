import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateResponse(message: string, userId: string, chatId: string) {
    try {
      // Store user message
      await addDoc(collection(db, "chats"), {
        userId,
        chatId,
        role: "user",
        content: message,
        timestamp: serverTimestamp(),
      });

      // Get AI response
      const result = await this.model.generateContent(message);
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

      return text;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}
