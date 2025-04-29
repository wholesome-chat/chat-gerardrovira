import { ServerMessage } from "../../../shared/websocketData";

class ChatStore {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("chat", 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("messages")) {
          const store = db.createObjectStore("messages", {
            keyPath: "id",
          });
          store.createIndex("room_channel", ["room", "channel"], {
            unique: false,
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveMessage(room: string, channel: string, message: ServerMessage) {
    const db = await this.dbPromise;
    const tx = db.transaction("messages", "readwrite");
    const store = tx.objectStore("messages");

    // Check if a message with the same ID already exists
    const existingMessage = await new Promise<ServerMessage | undefined>(
      (resolve, reject) => {
        const request = store.get(message.id);
        request.onsuccess = () =>
          resolve(request.result as ServerMessage | undefined);
        request.onerror = () => reject(request.error);
      }
    );

    if (existingMessage) {
      // Update the existing message
      store.put({ ...existingMessage, ...message, room, channel });
    } else {
      // Add the new message
      store.put({ ...message, room, channel });
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getMessages(room: string, channel: string): Promise<ServerMessage[]> {
    const db = await this.dbPromise;
    const tx = db.transaction("messages", "readonly");
    const store = tx.objectStore("messages");
    const index = store.index("room_channel");
    const request = index.getAll([room, channel]);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as Array<ServerMessage>);
      request.onerror = () => reject(request.error);
    });
  }
}

export const storeInstance = new ChatStore();
