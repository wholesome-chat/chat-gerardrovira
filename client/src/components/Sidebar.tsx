import React from "react";
import { useChatContext } from "./ChatContext";
import Avatar from "./Avatar";

export default function Sidebar() {
  const { user } = useChatContext();
  return (
    <div className="w-1/5 bg-gray-800 p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">Channels</h2>
        <ul className="space-y-2">
          <li className="cursor-pointer hover:text-gray-400">Channel 1</li>
          <li className="cursor-pointer hover:text-gray-400">Channel 2</li>
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
