import { auth } from "@/app/(auth)/auth";
import { store } from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return new Response("chatId is required", { status: 400 });
    }

    const votes = store.votes.get(chatId) || [];
    return Response.json(votes);
  } catch (error) {
    console.error("Vote GET error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { chatId, messageId, type } = await request.json();
    if (!chatId || !messageId || !type) {
      return new Response("Invalid request", { status: 400 });
    }

    const votes = store.votes.get(chatId) || [];
    votes.push({ messageId, type, userId: session.user.id });
    store.votes.set(chatId, votes);

    return new Response("Vote recorded", { status: 200 });
  } catch (error) {
    console.error("Vote PATCH error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
