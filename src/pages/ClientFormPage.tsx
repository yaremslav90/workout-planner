import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ClientStatus, Client } from "../types/client";
import { loadClients, saveClients } from "../storage/clientsStorage";

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `c_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function ClientFormPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [status, setStatus] = useState<ClientStatus>("active");
  const [goal, setGoal] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      alert("First name and last name are required.");
      return;
    }

    const newClient: Client = {
      id: makeId(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      heightCm,
      weightKg,
      status,
      goal: goal.trim(),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const current = loadClients();
    const next = [newClient, ...current];
    saveClients(next);

    navigate("/"); // повертаємось на таблицю
  }

  return (
    <div>
      <h1>Add client</h1>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 12, maxWidth: 420 }}
      >
        <label>
          First name
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>

        <label>
          Last name
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>

        <label>
          Height (cm)
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
          />
        </label>

        <label>
          Weight (kg)
          <input
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ClientStatus)}
          >
            <option value="active">active</option>
            <option value="paused">paused</option>
          </select>
        </label>

        <label>
          Goal
          <input value={goal} onChange={(e) => setGoal(e.target.value)} />
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
