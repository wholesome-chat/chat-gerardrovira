import "./App.css";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3R1c2VyIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDU2ODE1ODQsImV4cCI6MTc0NjI4NjM4NH0.02Qs5LOapq68pgE_T_lzsw44ROUgVhsRYlAcHGxAIB8";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Replace with the token generated from your server
    const socket = new WebSocket(`ws://localhost:8080?token=${token}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (ws) {
      ws.send("Hello world!");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1
        className="text-3xl font-bold underline cursor-pointer"
        onClick={handleSendMessage}
      >
        Send Hello World!
      </h1>
      <div className="w-1/2 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold">Messages:</h2>
        <ul className="mt-2 space-y-2">
          {messages.map((message, index) => (
            <li key={index} className="text-gray-700">
              {message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
