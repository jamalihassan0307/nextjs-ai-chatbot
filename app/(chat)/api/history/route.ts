import { auth } from "@/app/(auth)/auth";
import { getUserChats } from "@/lib/firebase/firestore";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return Response.json("Unauthorized!", { status: 401 });
  }

  const chats = await getUserChats(session.user.id);
  return Response.json(chats);
}
