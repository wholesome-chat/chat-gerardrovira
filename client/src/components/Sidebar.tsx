import React from "react";

const Sidebar = () => {
  return (
    <div className="w-1/5 bg-gray-800 p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">Rooms</h2>
        <ul className="space-y-2">
          <li className="cursor-pointer hover:text-gray-400">Channel 1</li>
          <li className="cursor-pointer hover:text-gray-400">Channel 2</li>
        </ul>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
        <div>
          <p className="font-semibold">Name</p>
          <p className="text-sm text-green-400">Online</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
