import { createContext, useContext } from "react";
import { Message } from "./ChatManager";

export const ChatContext = createContext<{
  messages: Array<Message>;
  sendMessage: (content: string, optimisticId: string) => void;
}>({
  messages: [],
  sendMessage: () => {
    throw new Error("Not implemented");
  },
});

export const useChatContext = () => useContext(ChatContext);
