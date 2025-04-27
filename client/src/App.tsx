import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import UserList from "./components/UserList";

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <ChatArea />
      <UserList />
    </div>
  );
}

export default App;
