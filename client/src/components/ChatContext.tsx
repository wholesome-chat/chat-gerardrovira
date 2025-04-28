import { createContext, useContext } from "react";
import { Message } from "./ChatManager";
import { User } from "../../../shared/websocketData";

export const ChatContext = createContext<{
  activeUsers: Array<User>;
  messages: Array<Message>;
  sendMessage: (content: string, optimisticId: string) => void;
}>({
  activeUsers: [],
  messages: [],
  sendMessage: () => {
    throw new Error("Not implemented");
  },
});

export const useChatContext = () => useContext(ChatContext);
