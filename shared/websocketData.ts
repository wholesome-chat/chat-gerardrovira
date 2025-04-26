type WebsocketData =
  | {
      type: "MESSAGE";
      data: string;
      server: string;
    }
  | { type: "AUTH"; username: string; password: string }
  | { type: "REGISTER_SERVER" };

export function serialize(data: WebsocketData) {
  return JSON.stringify(data);
}

export function deserialize(data: string): WebsocketData {
  return JSON.parse(data);
}
