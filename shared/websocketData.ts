type WebsocketData =
  | {
      type: "MESSAGE";
      data: string;
    }
  | { type: "AUTH"; username: string; password: string };

export function serialize(data: WebsocketData) {
  return JSON.stringify(data);
}

export function deserialize(data: string): WebsocketData {
  return JSON.parse(data);
}
