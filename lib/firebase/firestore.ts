import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./init";

export interface ChatData {
  id: string;
  userId: string;
  title: string;
  messages: any[];
  createdAt: Date;
}

export const saveChat = async (chatData: ChatData) => {
  try {
    const chatsRef = collection(db, "chats");
    await addDoc(chatsRef, {
      ...chatData,
      createdAt: Timestamp.fromDate(chatData.createdAt),
    });
    return true;
  } catch (error) {
    console.error("Error saving chat:", error);
    return false;
  }
};

export const getUserChats = async (userId: string) => {
  try {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
      };
    });
  } catch (error) {
    console.error("Error getting chats:", error);
    return [];
  }
};

export const deleteChat = async (chatId: string) => {
  try {
    await deleteDoc(doc(db, "chats", chatId));
    return true;
  } catch (error) {
    console.error("Error deleting chat:", error);
    return false;
  }
};
