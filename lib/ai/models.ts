import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
export const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: "gemini-pro",
    label: "Gemini Pro",
    apiIdentifier: "gemini-pro",
    description: "Google's most capable model for text generation",
  },
];

export const DEFAULT_MODEL_NAME = "gemini-pro";
