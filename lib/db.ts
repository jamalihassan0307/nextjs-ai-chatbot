import { db } from "./firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export async function getChatHistory(userId: string) {
  try {
    const q = query(
      collection(db, "chats"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting chat history:", error);
    throw error;
  }
}
