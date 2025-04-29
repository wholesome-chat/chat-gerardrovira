import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { useChatContext } from "./ChatContext";
import { User } from "../../../shared/websocketData";
import Avatar from "./Avatar";

export default function ChatArea({ channel }: { channel: string }) {
  const { messages, activeUsers } = useChatContext();
  const userIdToUserMap = React.useMemo(() => {
    const map = new Map<string, User>();
    activeUsers.forEach((user) => {
      map.set(user.id, user);
    });
    return map;
  }, [activeUsers]);
  const chatContainerRef = React.useRef<HTMLDivElement | null>(null);
  const shouldScroll = useRef<boolean>(true);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    shouldScroll.current = false;

    const handleScroll = () => {
      if (chatContainer) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainer;
        shouldScroll.current = scrollTop + clientHeight >= scrollHeight - 10;
      }
    };

    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer && shouldScroll.current) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);
  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="border-b border-gray-700 pb-2 mb-4">
        <h2 className="text-2xl font-bold">{channel}</h2>
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => {
          let key = message.optimisticId;
          let created = "";
          let userName = "";
          let email: void | string = undefined;
          if (message.type === "SERVER_MESSAGE") {
            key = message.id;
            created = new Date(message.created).toLocaleTimeString();
            const user = userIdToUserMap.get(message.userId);
            if (user !== undefined) {
              userName = (user.name ?? user.id).substring(0, 12);
              email = user.email;
            } else {
              userName = message.id.substring(0, 12);
            }
          }
          return (
            <div key={key} className="flex items-start space-x-4">
              <Avatar email={email} />
              <div>
                <p className="font-semibold">
                  {userName}{" "}
                  <span className="text-sm text-gray-400">{created}</span>
                </p>
                <p className="text-gray-300">{message.content}</p>
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />
    </div>
  );
}
