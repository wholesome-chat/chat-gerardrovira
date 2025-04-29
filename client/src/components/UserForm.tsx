import React, { useState } from "react";

export type UserFormData = {
  email: string;
  name: string;
};

export default function UserForm({
  onSubmit,
}: {
  onSubmit: (user: UserFormData) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() && email.trim()) {
      const user: UserFormData = { name, email }; // Use email as unique ID
      localStorage.setItem("chatUser", JSON.stringify(user)); // Store in local storage
      onSubmit(user);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded shadow-md space-y-4 w-80"
      >
        <h1 className="text-xl font-bold">Enter Your Details</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-gray-100 focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-gray-100 focus:outline-none"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 rounded hover:bg-blue-500 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
