import React, { useState, useRef } from "react";
import { useChatContext } from "./ChatContext";

let i = 0;

const MessageInput = () => {
  const { sendMessage } = useChatContext();
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    sendMessage(content, String(i++));
    setContent("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && content !== "") {
      handleSend();
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <input
        ref={inputRef}
        type="text"
        value={content}
        placeholder="Type a message"
        className="flex-1 p-2 bg-gray-700 rounded text-gray-100 focus:outline-none"
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        disabled={content === ""}
        className="p-2 bg-blue-600 rounded hover:bg-blue-500 transition"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
