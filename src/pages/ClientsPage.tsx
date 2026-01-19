import { useEffect, useMemo, useState } from "react";
import { seedClients } from "../data/seed";
import { Link } from "react-router-dom";
import type { Client, ClientStatus } from "../types/client";
import {
  loadClients,
  saveClients,
  deleteClientById,
} from "../storage/clientsStorage";

type sortKey = "name" | "updatedAt";
type sortDir = "asc" | "desc";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(() => {
    const stored = loadClients();
    if (stored.length) return stored;
    saveClients(seedClients);
    return seedClients;
  });

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ClientStatus>("all");
  const [sortKey, setSortKey] = useState<sortKey>("updatedAt");
  const [sortDir, setSortDir] = useState<sortDir>("desc");

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
  function toggleSort(nextKey: sortKey) {
    if (sortKey === nextKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(nextKey);
      setSortDir("asc");
    }
  }
  const visibleClients = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = clients;

    if (status !== "all") {
      list = list.filter((c) => c.status === status);
    }
    if (q) {
      list = list.filter((c) => {
        const full = `${c.firstName} ${c.lastName}`.toLowerCase();
        return full.includes(q);
      });
    }
    const sorted = [...list].sort((a, b) => {
      if (sortKey === "name") {
        const an = `${a.firstName} ${a.lastName}`.toLowerCase();
        const bn = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (an < bn) return -1;
        if (an > bn) return 1;
        return 0;
      }
      if (a.updatedAt < b.updatedAt) return -1;
      if (a.updatedAt > b.updatedAt) return 1;
      return 0;
    });
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [clients, query, status, sortKey, sortDir]);

  return (
    <div>
      <h1>Clients</h1>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "end",
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          Search
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name..."
          />
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "all" | ClientStatus)}
          >
            <option value="all">all</option>
            <option value="active">active</option>
            <option value="paused">paused</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: 6 }}>
          Sort
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as sortKey)}
          >
            <option value="updatedAt">updated</option>
            <option value="name">name</option>
          </select>
        </label>
        <button
          type="button"
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
        >
          Direction: {sortDir}
        </button>
        <div style={{ marginLeft: "auto", opacity: 0.8 }}>
          Showing: {visibleClients.length}
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              align="left"
              style={{ cursor: "pointer" }}
              onClick={() => toggleSort("name")}
              title="Sort by name"
            >
              Name {sortKey === "name" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </th>
            <th align="left">Height</th>
            <th align="left">Weight</th>
            <th align="left">Status</th>
            <th align="left">Goal</th>
            <th
              align="left"
              style={{ cursor: "pointer" }}
              onClick={() => toggleSort("updatedAt")}
              title="Sort by updated"
            >
              Updated{" "}
              {sortKey === "updatedAt" ? (sortDir === "asc" ? "▲" : "▼") : ""}
            </th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleClients.map((c) => (
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
          {visibleClients?.length === 0 && (
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
