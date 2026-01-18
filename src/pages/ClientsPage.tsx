import { useEffect, useState } from "react";
import { seedClients } from "../data/seed";
import { Link } from "react-router-dom";
import type { Client } from "../types/client";
import {
  loadClients,
  saveClients,
  deleteClientById,
} from "../storage/clientsStorage";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(() => {
    const stored = loadClients();
    if (stored.length) return stored;
    saveClients(seedClients);
    return seedClients;
  });

  useEffect(() => {
    const stored = loadClients();
    if (stored.length > 0) {
      setClients(stored);
    } else {
      setClients(seedClients);
      saveClients(seedClients);
    }
  }, []);

  const handleDelete = (id: string) => {
    const ok = window.confirm("Delete this client?");
    if (!ok) return;
    const updatedRows = deleteClientById(id);
    setClients(updatedRows);
  };
  return (
    <div>
      <h1>Clients</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Height</th>
            <th align="left">Weight</th>
            <th align="left">Status</th>
            <th align="left">Goal</th>
            <th align="left">Updated</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id} style={{ borderTop: "1px solid #aaa" }}>
              <td style={{ padding: "10px 6px" }}>
                <Link to={`/clients/${c.id}`}>
                  {c.firstName} {c.lastName}
                </Link>
              </td>
              <td style={{ padding: "10px 6px" }}>{c.heightCm}</td>
              <td style={{ padding: "10px 6px" }}>{c.weightKg}</td>
              <td style={{ padding: "10px 6px" }}>{c.status}</td>
              <td style={{ padding: "10px 6px" }}>{c.goal}</td>
              <td style={{ padding: "10px 6px" }}>{c.updatedAt}</td>
              <td style={{ padding: "10px 6px" }}>
                <button onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {clients?.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: 12 }}>
                No clients yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
