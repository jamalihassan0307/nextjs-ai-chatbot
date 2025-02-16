interface Chat {
  id: string;
  userId: string;
  messages: any[];
  createdAt: Date;
}

interface Vote {
  messageId: string;
  type: "up" | "down";
  userId: string;
}

interface Store {
  chats: Map<string, Chat>;
  votes: Map<string, Vote[]>;
}

export const store: Store = {
  chats: new Map(),
  votes: new Map(),
};
