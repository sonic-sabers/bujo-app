import { type Message } from "../types/chat";

const DB_NAME = "bujo-chat-db";
const DB_VERSION = 1;
const STORE_NAME = "chat-messages";
const LS_KEY = "bujo-chat-messages";

class ChatStorage {
  private db: IDBDatabase | null = null;
  private isIndexedDBAvailable: boolean = true;

  constructor() {
    this.initDB();
  }

  private async initDB() {
    if (typeof window === "undefined" || !window.indexedDB) {
      console.warn("IndexedDB not available, falling back to localStorage");
      this.isIndexedDBAvailable = false;
      return;
    }

    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("Failed to open IndexedDB");
        this.isIndexedDBAvailable = false;
        reject();
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });
  }

  private ensureDBReady(): Promise<void> {
    if (!this.isIndexedDBAvailable) {
      return Promise.resolve();
    }
    if (this.db) {
      return Promise.resolve();
    }
    return this.initDB();
  }

  async saveMessages(messages: Message[]): Promise<void> {
    try {
      await this.ensureDBReady();

      if (this.isIndexedDBAvailable && this.db) {
        const transaction = this.db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        // Clear existing messages
        await new Promise<void>((resolve, reject) => {
          const clearRequest = store.clear();
          clearRequest.onsuccess = () => resolve();
          clearRequest.onerror = () => reject(clearRequest.error);
        });

        // Add all messages
        for (const message of messages) {
          await new Promise<void>((resolve, reject) => {
            const addRequest = store.add({
              ...message,
              timestamp: message.timestamp.toISOString(),
            });
            addRequest.onsuccess = () => resolve();
            addRequest.onerror = () => reject(addRequest.error);
          });
        }

        await new Promise<void>((resolve, reject) => {
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        });
      } else {
        // Fallback to localStorage
        const serializedMessages = messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        }));
        localStorage.setItem(LS_KEY, JSON.stringify(serializedMessages));
      }
    } catch (error) {
      console.error("Failed to save messages:", error);
      // Try localStorage as fallback
      try {
        const serializedMessages = messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        }));
        localStorage.setItem(LS_KEY, JSON.stringify(serializedMessages));
      } catch (lsError) {
        console.error("Failed to save to localStorage:", lsError);
      }
    }
  }

  async loadMessages(): Promise<Message[]> {
    try {
      await this.ensureDBReady();

      if (this.isIndexedDBAvailable && this.db) {
        const transaction = this.db.transaction([STORE_NAME], "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        return new Promise((resolve, reject) => {
          request.onsuccess = () => {
            const messages = request.result.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }));
            // Sort messages by timestamp to maintain correct order
            messages.sort(
              (a: Message, b: Message) =>
                a.timestamp.getTime() - b.timestamp.getTime()
            );
            resolve(messages);
          };
          request.onerror = () => reject(request.error);
        });
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem(LS_KEY);
        if (!stored) return [];

        const messages = JSON.parse(stored);
        const parsedMessages = messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        // Sort messages by timestamp to maintain correct order
        parsedMessages.sort(
          (a: Message, b: Message) =>
            a.timestamp.getTime() - b.timestamp.getTime()
        );
        return parsedMessages;
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      // Try localStorage as fallback
      try {
        const stored = localStorage.getItem(LS_KEY);
        if (!stored) return [];

        const messages = JSON.parse(stored);
        const parsedMessages = messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        // Sort messages by timestamp to maintain correct order
        parsedMessages.sort(
          (a: Message, b: Message) =>
            a.timestamp.getTime() - b.timestamp.getTime()
        );
        return parsedMessages;
      } catch (lsError) {
        console.error("Failed to load from localStorage:", lsError);
        return [];
      }
    }
  }

  async clearMessages(): Promise<void> {
    try {
      await this.ensureDBReady();

      if (this.isIndexedDBAvailable && this.db) {
        const transaction = this.db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        await new Promise<void>((resolve, reject) => {
          const clearRequest = store.clear();
          clearRequest.onsuccess = () => resolve();
          clearRequest.onerror = () => reject(clearRequest.error);
        });

        await new Promise<void>((resolve, reject) => {
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        });
      } else {
        // Fallback to localStorage
        localStorage.removeItem(LS_KEY);
      }
    } catch (error) {
      console.error("Failed to clear messages:", error);
      // Try localStorage as fallback
      try {
        localStorage.removeItem(LS_KEY);
      } catch (lsError) {
        console.error("Failed to clear from localStorage:", lsError);
      }
    }
  }
}

let chatStorageInstance: ChatStorage | null = null;

export const getChatStorage = (): ChatStorage => {
  if (typeof window === "undefined") {
    throw new Error("ChatStorage can only be used in browser environment");
  }
  if (!chatStorageInstance) {
    chatStorageInstance = new ChatStorage();
  }
  return chatStorageInstance;
};
