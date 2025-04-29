import { WebSocketServer, WebSocket } from "ws";
import {
  deserialize,
  serialize,
  USER_ID,
  ClientMessage,
  User,
  ClientUser,
} from "../../shared/websocketData";
import { AI_USER, streamChatResponse } from "./ai";

const PORT = Number(process.env.PORT) || 8080;
const SERVER_NAME = "YOLO";

const wss = new WebSocketServer({ port: PORT });
const roomConnections = new Map<
  string,
  Map<USER_ID, { ws: null | WebSocket; user: User }>
>();

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
    currentRoomConnections = new Map<
      USER_ID,
      { ws: null | WebSocket; user: User }
    >();
    currentRoomConnections.set(AI_USER.id, { ws: null, user: AI_USER });
    roomConnections.set(room, currentRoomConnections);
  }
  currentRoomConnections.set(userId, { ws, user: { id: userId } });

  onActiveUsers();

  ws.on("message", (message) => {
    const data = deserialize(message.toString());
    switch (data.type) {
      case "CLIENT_MESSAGE":
        onMessage(data);
        break;
      case "CLIENT_USER":
        onEditUser(data);
        break;
      default:
        console.log(`Unknown message type: ${data.type}`);
        break;
    }
  });

  async function onMessage(message: ClientMessage) {
    const now = Date.now();
    if (message.content.toLowerCase().startsWith("@ai")) {
      const prompt = message.content.slice(3).trim();
      const responseStream = await streamChatResponse(prompt);
      const messageId = crypto.randomUUID();
      for await (const content of responseStream) {
        sendMessage(messageId, now, Date.now(), AI_USER.id, {
          ...message,
          content,
        });
      }
    } else {
      sendMessage(crypto.randomUUID(), now, now, userId, message);
    }
  }

  function sendMessage(
    messageId: string,
    created: number,
    updated: number,
    userId: string,
    message: ClientMessage
  ) {
    const { content, channel, optimisticId } = message;
    for (const { ws } of currentRoomConnections.values()) {
      if (ws !== null) {
        ws.send(
          serialize({
            type: "SERVER_MESSAGE",
            id: messageId,
            optimisticId,
            content,
            channel,
            server: SERVER_NAME,
            userId,
            created,
            updated,
          })
        );
      }
    }
  }

  function onActiveUsers() {
    const users: Array<User> = Array.from(currentRoomConnections.values()).map(
      ({ user }) => user
    );
    for (const { ws } of currentRoomConnections.values()) {
      if (ws !== null) {
        ws.send(
          serialize({
            type: "ACTIVE_USERS",
            users,
          })
        );
      }
    }
  }

  function onEditUser({ user }: ClientUser) {
    const storedUser = currentRoomConnections.get(userId).user;
    storedUser.name = user.name;
    storedUser.email = user.email;

    onActiveUsers();
    ws.send(
      serialize({
        type: "SELF",
        user: storedUser,
      })
    );
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
