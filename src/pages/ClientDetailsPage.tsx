import { Link, useParams } from "react-router-dom";
import { getClientById } from "../storage/clientsStorage";

export default function ClientDetailsPage() {
  const { id } = useParams();

  if (!id) {
    return (
      <div>
        <h1>Client not found</h1>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  const client = getClientById(id);
  if (!client) {
    return (
      <div>
        <h1>Client not found</h1>
        <p>No client with this id: {id}</p>
        <Link to="/">Back to home</Link>
      </div>
    );
  }
  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <h1>
          {client.firstName} {client.lastName}
        </h1>

        <div style={{ display: "flex", gap: 10 }}>
          <Link to={`/clients/${client.id}/edit`}>Edit</Link>
          <Link to="/">Home</Link>
        </div>
      </div>

      <div style={{ border: "1px solid #aaa", padding: 12, borderRadius: 8 }}>
        <p>
          <b>Status:</b> {client.status}
        </p>
        <p>
          <b>Height:</b> {client.heightCm}
        </p>
        <p>
          <b>Weight:</b> {client.weightKg}
        </p>
        <p>
          <b>Goal:</b> {client.goal || "-"}
        </p>
        <p>
          <b>Updated:</b> {client.updatedAt}
        </p>
      </div>
    </div>
  );
}
