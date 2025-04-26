import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { deserialize } from "../../shared/websocketData";

const PORT = 8080;
const SECRET_KEY = "YOLO";

const wss = new WebSocketServer({ port: PORT });

const payload = {
  username: "testuser",
  role: "user",
};
const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1w" });
console.info(token);

wss.on("connection", (ws, req) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const token = url.searchParams.get("token");

  if (!token) {
    ws.close(1008, "Authentication required");
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Authenticated user:", decoded);

    ws.on("message", (message) => {
      const data = deserialize(message.toString());
      switch (data.type) {
        case "MESSAGE":
          console.log(`Received type MESSAGE: ${data.data}`);
          break;
        default:
          console.log(`Unknown message type: ${data.type}`);
          break;
      }
      ws.send(`Server received: ${message}`);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  } catch (err) {
    ws.close(1008, "Invalid token");
  }
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
