import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import UserList from "./components/UserList";
import ChatManager from "./components/ChatManager";
import UserForm, { UserFormData } from "./components/UserForm";
import { useState } from "react";

function App() {
  const [user, setUser] = useState<UserFormData | null>(() => {
    const storedUser = localStorage.getItem("chatUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [channel, setChannel] = useState("Main");

  if (user === null) {
    return <UserForm onSubmit={setUser} />;
  }

  return (
    <ChatManager userFormData={user} channel={channel}>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        <Sidebar onChannelSelect={setChannel} />
        <ChatArea channel={channel} />
        <UserList />
      </div>
    </ChatManager>
  );
}

export default App;
