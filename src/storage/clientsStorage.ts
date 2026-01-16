import type { Client } from "../types/client";

const KEY = "clients_vi";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage ?? null;
}

export function loadClients(): Client[] {
  const storage = getStorage();
  if (!storage) return [];

  const raw = storage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Client[];
  } catch {
    return [];
  }
}

export function saveClients(clients: Client[]) {
  const storage = getStorage();
  if (!storage) return;

  storage.setItem(KEY, JSON.stringify(clients));
}
