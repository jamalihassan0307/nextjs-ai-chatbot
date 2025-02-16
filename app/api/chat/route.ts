import { NextResponse } from "next/server";
import { GeminiService } from "@/lib/services/gemini.service";

const gemini = new GeminiService(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // Read the request body only once
    const body = await req.clone().json();
    console.log("[API] Request:", body);

    if (!body.message) {
      return new NextResponse(JSON.stringify({ error: "Missing message" }), {
        status: 400,
      });
    }

    // Get AI response
    const aiResponse = await gemini.generateResponse(body.message);
    console.log("[API] AI Response:", aiResponse);

    // Structure the response
    const responseData = {
      role: "assistant",
      content: aiResponse,
      timestamp: Date.now(),
    };

    console.log("[API] Final Response:", responseData);
    return new NextResponse(JSON.stringify(responseData));
  } catch (error: any) {
    console.error("[API] Error:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}
