import React from "react";
import MessageInput from "./MessageInput";

const ChatArea = () => {
  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="border-b border-gray-700 pb-2 mb-4">
        <h2 className="text-2xl font-bold">Channel Name</h2>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
          <div>
            <p className="font-semibold">
              Name <span className="text-sm text-gray-400">Date</span>
            </p>
            <p className="text-gray-300">Message</p>
          </div>
        </div>
        {/* Repeat message bubbles */}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatArea;
