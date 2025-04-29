import { useCallback, useEffect, useRef, useState } from "react";
import { wsInstance } from "./ChatWebSocket";
import {
  ClientMessage,
  ServerMessage,
  User,
} from "../../../shared/websocketData";
import { ChatContext } from "./ChatContext";
import { storeInstance } from "./ChatStore"; // Import the storage class
import { UserFormData } from "./UserForm";

export type Message = ClientMessage | ServerMessage;

const ROOM = "main";
const HOST = "localhost";
const PORT = 8080;

export default function ChatManager({
  channel,
  children,
  userFormData,
}: {
  userFormData: UserFormData;
  channel: string;
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [user, setUser] = useState<null | User>(null);
  const [activeUsers, setActiveUsers] = useState<Array<User>>([]);
  const restorationPromise = useRef<Promise<void> | null>(null);

  useEffect(() => {
    wsInstance.connect(HOST, PORT, ROOM);

    restorationPromise.current = (async () => {
      const persistedMessages = await storeInstance.getMessages(ROOM, channel);
      setMessages(persistedMessages);
    })();

    return wsInstance.onSelf(setUser);
  }, [channel]);

  useEffect(() => {
    const handleConnected = () => {
      wsInstance.editUser({ id: "", ...userFormData });
    };
    return wsInstance.onConnected(handleConnected);
  }, [userFormData]);

  useEffect(() => {
    setMessages([]);
    const handleMessage = async (message: ServerMessage) => {
      if (restorationPromise.current != null) {
        await restorationPromise.current;
      }
      if (message.channel === channel) {
        setMessages((prevMessages) => {
          const existingIndex = prevMessages.findIndex(
            (m) => m.type === "SERVER_MESSAGE" && m.id === message.id
          );
          if (existingIndex !== -1) {
            // Replace the existing message
            const updatedMessages = [...prevMessages];
            updatedMessages[existingIndex] = message;
            return updatedMessages;
          }
          // Add the new message
          return [...prevMessages, message];
        });
      }
      storeInstance.saveMessage(ROOM, message.channel, message).catch((e) => {
        console.error(e);
      });
    };

    return wsInstance.onMessage(handleMessage);
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
    <ChatContext value={{ channel, activeUsers, messages, sendMessage, user }}>
      {children}
    </ChatContext>
  );
}
