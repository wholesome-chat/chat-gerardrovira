export type USER_ID = string;

export type User = {
  id: USER_ID;
  name?: string;
  email?: string;
};

export type ClientMessage = {
  type: "CLIENT_MESSAGE";
  content: string;
  channel: string;
  optimisticId: string;
};

export type ServerMessage = {
  type: "SERVER_MESSAGE";
  id: string;
  optimisticId: string;
  content: string;
  server: string;
  userId: USER_ID;
  channel: string;
  created: number;
  updated: number;
};

export type ServerActiveUsers = {
  type: "ACTIVE_USERS";
  users: Array<User>;
};

type WebsocketData = ClientMessage | ServerMessage | ServerActiveUsers;

export function serialize(data: WebsocketData) {
  return JSON.stringify(data);
}

export function deserialize(data: string): WebsocketData {
  return JSON.parse(data);
}
