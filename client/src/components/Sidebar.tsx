import React, { useState } from "react";
import { useChatContext } from "./ChatContext";
import Avatar from "./Avatar";

export default function Sidebar({
  onChannelSelect,
}: {
  onChannelSelect: (channel: string) => void;
}) {
  const { user, channel } = useChatContext();
  const [selectedChannel, setSelectedChannel] = useState(channel);

  const handleChannelClick = (newChannel: string) => {
    setSelectedChannel(newChannel);
    onChannelSelect(newChannel); // Notify parent of the selected channel
  };

  return (
    <div className="w-1/5 bg-gray-800 p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">Channels</h2>
        <ul className="space-y-2">
          {["Main", "Second", "Test"].map((ch) => (
            <li
              key={ch}
              className={`cursor-pointer hover:text-gray-400 ${
                selectedChannel === ch ? "text-blue-400 font-bold" : ""
              }`}
              onClick={() => handleChannelClick(ch)}
            >
              {ch}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center space-x-2">
        {user !== null && (
          <>
            <Avatar email={user.email} />
            <div>
              <p className="font-semibold">
                {(user.name ?? user.id).substring(0, 12)}
              </p>
              <p className="text-sm text-green-400">Online</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
