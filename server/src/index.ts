import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { deserialize, serialize } from "../../shared/websocketData";

const PORT = 8080;
const SECRET_KEY = "YOLO";

const SERVER_NAME = "YOLO";

const wss = new WebSocketServer({ port: PORT });

const payload = {
  username: "testuser",
  role: "user",
};
const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1w" });
console.info(token);

// const serversIps = 'github.fitxser.raw'
const serverIps = ["localhost"];
const receivers = new Set<WebSocket>();

for (const serverIp of serverIps) {
  const ws = new WebSocket(`ws://${serverIp}:${PORT}?token=${token}`);

  ws.on("open", () => {
    // console.log(`Connected to server at ${serverIp}`);
    // receivers.add(ws);
  });

  ws.on("message", (message) => {
    const data = deserialize(message.toString());
    // if (data.type === "MESSAGE") {
    // for (const receiverWs of receivers) {
    //   receiverWs.send(
    //     serialize({
    //       type: "MESSAGE",
    //       data: `Received ${data.data}`,
    //       server: SERVER_NAME,
    //     })
    //   );
    // }
    // }
  });

  ws.on("close", () => {
    // console.log(`Disconnected from server at ${serverIp}`);
    receivers.delete(ws);
  });

  ws.on("error", (err) => {
    // console.error(`Error with server at ${serverIp}:`, err);
  });
}

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
    receivers.add(ws);

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
      if (data.type === "MESSAGE") {
        for (const receiverWs of receivers) {
          receiverWs.send(
            serialize({
              type: "MESSAGE",
              data: `Received ${data.data}`,
              server: SERVER_NAME,
            })
          );
        }
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      receivers.delete(ws);
    });
  } catch (err) {
    ws.close(1008, "Invalid token");
  }
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
