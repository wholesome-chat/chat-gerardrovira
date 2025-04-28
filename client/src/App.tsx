import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import UserList from "./components/UserList";
import ChatManager from "./components/ChatManager";

const CHANNEL = "main";

function App() {
  return (
    <ChatManager channel={CHANNEL}>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        <Sidebar />
        <ChatArea />
        <UserList />
      </div>
    </ChatManager>
  );
}

export default App;
