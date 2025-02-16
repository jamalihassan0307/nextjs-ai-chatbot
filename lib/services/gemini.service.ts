import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error(
        error instanceof Error
          ? `AI Model Error: ${error.message}`
          : "An unknown error occurred"
      );
    }
  }

  async generateCodeResponse(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt, {
        generationConfig: {
          temperature: 0.3,
          topP: 0.8,
          topK: 40,
        },
      });
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating code:", error);
      throw new Error("Failed to generate code");
    }
  }
}
