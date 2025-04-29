import { createContext, useContext } from "react";
import { Message } from "./ChatManager";
import { User } from "../../../shared/websocketData";

export const ChatContext = createContext<{
  activeUsers: Array<User>;
  messages: Array<Message>;
  sendMessage: (content: string, optimisticId: string) => void;
  user: User | null; // Add user to the context
}>({
  activeUsers: [],
  messages: [],
  sendMessage: () => {
    throw new Error("Not implemented");
  },
  user: null, // Default to null
});

export const useChatContext = () => useContext(ChatContext);
