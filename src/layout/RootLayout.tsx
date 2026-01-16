import { NavLink, Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div style={{ padding: 16 }}>
      <header style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/clients/new">Add Client</NavLink>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
