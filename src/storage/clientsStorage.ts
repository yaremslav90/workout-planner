import type { Client } from "../types/client";

const KEY = "clients_v1";

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

export function deleteClientById(id: string): Client[] {
  const current = loadClients();
  const next = current.filter((c) => c.id !== id);
  saveClients(next);
  return next;
}

export function getClientById(id: string): Client | undefined {
  const clients = loadClients();
  return clients.find((c) => c.id === id);
}

export function updateClientById(
  id: string,
  patch: Partial<Client>
): Client | undefined {
  const current = loadClients();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) return undefined;
  const updated: Client = {
    ...current[index],
    ...patch,
    id,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  const next = [...current];
  next[index] = updated;
  saveClients(next);
  return updated;
}
