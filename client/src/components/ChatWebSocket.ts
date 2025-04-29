import {
  ClientMessage,
  deserialize,
  serialize,
  ServerMessage,
  User,
} from "../../../shared/websocketData";

enum CONNECTED_STATUS {
  CONNECTING = 1,
  CONNECTED = 2,
  DISCONNECTED = 3,
}

class ChatWebSocket {
  #ws: null | WebSocket = null;
  #mesageListeners: Set<(message: ServerMessage) => void> = new Set();
  #activeUsersListeners: Set<(activeUsers: Array<User>) => void> = new Set();
  #connectedListeners: Set<() => void> = new Set();
  #selfListeners: Set<(user: User) => void> = new Set();

  connected: CONNECTED_STATUS = CONNECTED_STATUS.DISCONNECTED;

  connect(host: string, port: number, room: string) {
    if (this.connected !== CONNECTED_STATUS.DISCONNECTED) {
      return;
    }
    this.connected = CONNECTED_STATUS.CONNECTED;
    this.#ws = new WebSocket(`ws://${host}:${port}?room=${room}`);
    this.#ws.onopen = () => {
      this.connected = CONNECTED_STATUS.CONNECTED;
      for (const listener of this.#connectedListeners) {
        listener();
      }
    };
    this.#ws.onclose = () => {
      this.connected = CONNECTED_STATUS.DISCONNECTED;
      this.#ws = null;
    };
    this.#ws.onerror = console.error;

    this.#ws.onmessage = (event) => {
      const data = deserialize(event.data);
      switch (data.type) {
        case "SERVER_MESSAGE":
          for (const listener of this.#mesageListeners) {
            listener(data);
          }
          break;
        case "ACTIVE_USERS":
          for (const listener of this.#activeUsersListeners) {
            listener(data.users);
          }
          break;
        case "SELF": // Handle SELF message type
          for (const listener of this.#selfListeners) {
            listener(data.user);
          }
          break;
      }
    };
  }

  onSelf(fn: (user: User) => void): () => void {
    this.#selfListeners.add(fn);
    return () => {
      this.#selfListeners.delete(fn);
    };
  }

  onConnected(fn: () => void): () => void {
    this.#connectedListeners.add(fn);
    return () => {
      this.#connectedListeners.delete(fn);
    };
  }

  onMessage(fn: (message: ServerMessage) => void): () => void {
    this.#mesageListeners.add(fn);
    return () => {
      this.#mesageListeners.delete(fn);
    };
  }

  sendMessage(message: ClientMessage) {
    if (this.connected !== CONNECTED_STATUS.CONNECTED) {
      throw new Error("Not connected");
    }
    const ws = this.#ws!;
    ws.send(serialize(message));
  }

  onActiveUsers(fn: (activeUsers: Array<User>) => void): () => void {
    this.#activeUsersListeners.add(fn);
    return () => {
      this.#activeUsersListeners.delete(fn);
    };
  }

  editUser(user: User) {
    const ws = this.#ws!;
    ws.send(
      serialize({
        type: "CLIENT_USER",
        user,
      })
    );
  }
}

export const wsInstance = new ChatWebSocket();
