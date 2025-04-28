import React, { useState } from "react";
import { useChatContext } from "./ChatContext";

let i = 0;

const MessageInput = () => {
  const { sendMessage } = useChatContext();
  const [content, setContent] = useState("");
  const handleSend = () => {
    sendMessage(content, String(i++));
    setContent("");
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <input
        type="text"
        value={content}
        placeholder="Type a message"
        className="flex-1 p-2 bg-gray-700 rounded text-gray-100 focus:outline-none"
        onChange={(event) => setContent(event.target.value)}
      />
      <button
        onClick={handleSend}
        className="p-2 bg-blue-600 rounded hover:bg-blue-500 transition"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
