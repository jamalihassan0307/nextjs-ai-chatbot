import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "GEMINI_API_KEY is not configured in environment variables"
      );
    }

    try {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
    } catch (error: any) {
      console.error("Failed to initialize Gemini API:", error);
      throw new Error(
        "Failed to initialize Gemini API. Please check your API key and permissions."
      );
    }
  }

  private handleGeminiError(error: any): never {
    console.error("Gemini API Error:", error);

    if (error.message?.includes("SERVICE_DISABLED")) {
      throw new Error(
        "Gemini API is not enabled. Please enable it in your Google Cloud Console."
      );
    }

    if (error.message?.includes("HTTP_REFERRER_BLOCKED")) {
      throw new Error(
        "API access blocked. Please configure HTTP referrers in Google Cloud Console."
      );
    }

    throw new Error(`Gemini API Error: ${error.message || "Unknown error"}`);
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      // Create the generation request
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });

      // Wait for the response
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      return text;
    } catch (error: any) {
      if (error.message?.includes("HTTP_REFERRER_BLOCKED")) {
        console.error("Referrer blocked error. Current configuration:", {
          apiKey: process.env.GEMINI_API_KEY?.substring(0, 10) + "...",
          projectId: process.env.PROJECT_ID,
        });
      }
      throw error;
    }
  }

  async generateCodeResponse(prompt: string): Promise<string> {
    try {
      // Create the generation request
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });

      // Wait for the response
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Empty code response from Gemini API");
      }

      return text;
    } catch (error: any) {
      if (error.message?.includes("HTTP_REFERRER_BLOCKED")) {
        console.error("Referrer blocked error. Current configuration:", {
          apiKey: process.env.GEMINI_API_KEY?.substring(0, 10) + "...",
          projectId: process.env.PROJECT_ID,
        });
      }
      throw error;
    }
  }
}
