import React from "react";
import { useChatContext } from "./ChatContext";
import Avatar from "./Avatar";

export default function UserList() {
  const { activeUsers } = useChatContext();
  return (
    <div className="w-1/5 bg-gray-800 p-4">
      <h2 className="text-xl font-bold mb-4">Online</h2>
      <ul className="space-y-4">
        {activeUsers.map((user) => (
          <li key={user.id} className="flex items-center space-x-2">
            <Avatar email={user.email} />
            <p>{(user.name ?? user.id).substring(0, 12)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
