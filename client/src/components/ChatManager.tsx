import { useCallback, useEffect, useState } from "react";
import { wsInstance } from "./ChatWebSocket";
import {
  ClientMessage,
  ServerMessage,
  User,
} from "../../../shared/websocketData";
import { ChatContext } from "./ChatContext";

export type Message = ClientMessage | ServerMessage;

const ROOM = "main";
const HOST = "localhost";
const PORT = 8080;

export default function ChatManager({
  channel,
  children,
}: {
  channel: string;
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [activeUsers, setActiveUsers] = useState<Array<User>>([]);

  useEffect(() => {
    wsInstance.connect(HOST, PORT, ROOM);
  }, []);

  useEffect(() => {
    setMessages([]);
    return wsInstance.onMessage((message) => {
      if (message.channel === channel) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });
  }, [channel]);

  useEffect(() => {
    return wsInstance.onActiveUsers(setActiveUsers);
  }, []);

  const sendMessage = useCallback(
    (content: string, optimisticId: string) => {
      wsInstance.sendMessage({
        type: "CLIENT_MESSAGE",
        content,
        channel,
        optimisticId,
      });
    },
    [channel]
  );

  return (
    <ChatContext value={{ activeUsers, messages, sendMessage }}>
      {children}
    </ChatContext>
  );
}
