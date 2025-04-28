export type USER_ID = string;

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

type WebsocketData =
  | ClientMessage
  | ServerMessage
  | { type: "AUTH"; username: string; password: string }
  | { type: "REGISTER_SERVER" };

export function serialize(data: WebsocketData) {
  return JSON.stringify(data);
}

export function deserialize(data: string): WebsocketData {
  return JSON.parse(data);
}
