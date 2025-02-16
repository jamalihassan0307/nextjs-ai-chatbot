import { auth } from "@/app/(auth)/auth";
import { store } from "@/lib/store";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  const chats = Array.from(store.chats.values()).filter(
    (chat) => chat.userId === session.user.id
  );
  return Response.json(chats);
}
