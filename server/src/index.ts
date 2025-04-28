import { WebSocketServer, WebSocket } from "ws";
import {
  deserialize,
  serialize,
  USER_ID,
  ClientMessage,
  User,
} from "../../shared/websocketData";

const PORT = Number(process.env.PORT) || 8080;
const SERVER_NAME = "YOLO";

const wss = new WebSocketServer({ port: PORT });
const roomConnections = new Map<string, Map<USER_ID, WebSocket>>();

wss.on("connection", (ws, req) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const room = url.searchParams.get("room");
  if (room == null) {
    ws.close(3000, "Room required");
    return;
  }

  const userId = crypto.randomUUID();

  let currentRoomConnections = roomConnections.get(room);
  if (currentRoomConnections === undefined) {
    currentRoomConnections = new Map<USER_ID, WebSocket>();
    roomConnections.set(room, currentRoomConnections);
  }
  currentRoomConnections.set(userId, ws);

  onActiveUsers();

  ws.on("message", (message) => {
    const data = deserialize(message.toString());
    switch (data.type) {
      case "CLIENT_MESSAGE":
        onMessage(data);
        break;
      default:
        console.log(`Unknown message type: ${data.type}`);
        break;
    }
  });

  function onMessage(message: ClientMessage) {
    const { content, channel, optimisticId } = message;
    const now = Date.now();
    for (const ws of currentRoomConnections.values()) {
      ws.send(
        serialize({
          type: "SERVER_MESSAGE",
          id: crypto.randomUUID(),
          optimisticId,
          content,
          channel,
          server: SERVER_NAME,
          userId,
          created: now,
          updated: now,
        })
      );
    }
  }

  function onActiveUsers() {
    const users: Array<User> = Array.from(currentRoomConnections.keys()).map(
      (userId) => ({
        id: userId,
      })
    );
    for (const ws of currentRoomConnections.values()) {
      ws.send(
        serialize({
          type: "ACTIVE_USERS",
          users,
        })
      );
    }
  }

  ws.on("close", () => {
    currentRoomConnections.delete(userId);
    if (currentRoomConnections.size === 0) {
      roomConnections.delete(room);
    }
    onActiveUsers();
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
