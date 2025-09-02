export interface Member {
  id: string;
  created_at: string;
  profile: {
    name: string;
    imageUrl: string;
    status?: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  isDeleted: boolean;
  type: string;
  parent?: Message;
  reactions?: Reaction[];
  created_At: string;
}

export interface Chat {
  id: string;
  name?: string;
  lastMessage?: Message;
  members: Member[];
  created_at: string;
}

export interface SocketMessage {
  id: string;
  content: string;
  type: string;
  senderId: string;
}

export interface Reaction {
  id: string;
  userId: string;
  messageId: string;
  emoji: string;
}
