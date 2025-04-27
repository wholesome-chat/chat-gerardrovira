import React from "react";

const MessageInput = () => {
  const handleSend = () => {
    console.log("Send message");
  };

  return (
    <div className="flex items-center space-x-2 mt-4">
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 p-2 bg-gray-700 rounded text-gray-100 focus:outline-none"
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
