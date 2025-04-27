import React from "react";

const UserList = () => {
  return (
    <div className="w-1/5 bg-gray-800 p-4">
      <h2 className="text-xl font-bold mb-4">Online</h2>
      <ul className="space-y-4">
        <li className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
          <p>Name</p>
        </li>
        {/* Repeat for other users */}
      </ul>
    </div>
  );
};

export default UserList;
