import { NextResponse } from "next/server";
import { GeminiService } from "@/lib/services/gemini.service";

const gemini = new GeminiService();

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    console.log("[API] Request:", body);

    if (!body.message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const response = await gemini.generateResponse(body.message);

    return new NextResponse(
      JSON.stringify({
        role: "assistant",
        content: response,
        timestamp: Date.now(),
        model: "gemini-1.5-pro",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("[API] Error:", error);

    if (error.message?.includes("SERVICE_DISABLED")) {
      return new NextResponse(
        JSON.stringify({
          error: "Gemini API is not enabled.",
          details: "Please enable it in your Google Cloud Console.",
        }),
        {
          status: 503,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (error.message?.includes("HTTP_REFERRER_BLOCKED")) {
      return new NextResponse(
        JSON.stringify({
          error: "API access blocked.",
          details:
            "Please add http://localhost:3000 to your API key restrictions.",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        error: "Failed to generate response",
        details: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
