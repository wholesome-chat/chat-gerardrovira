import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { useChatContext } from "./ChatContext";

export default function ChatArea() {
  const { messages } = useChatContext();
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
        <h2 className="text-2xl font-bold">Channel Name</h2>
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => {
          let key = message.optimisticId;
          let created = "";
          let userName = "";
          if (message.type === "SERVER_MESSAGE") {
            key = message.id;
            created = new Date(message.created).toLocaleTimeString();
            userName = message.userId.substring(0, 12);
          }
          return (
            <div key={key} className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
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
