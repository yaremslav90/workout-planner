import { createBrowserRouter, Navigate } from "react-router-dom";
import ClientsPage from "../pages/ClientsPage";
import ClientFormPage from "../pages/ClientFormPage";
import ClientDetailsPage from "../pages/ClientDetailsPage";
import RootLayout from "../layout/RootLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <ClientsPage /> },
      { path: "clients/new", element: <ClientFormPage /> },
      { path: "clients/:id", element: <ClientDetailsPage /> },
      { path: "clients/:id/edit", element: <ClientFormPage /> },
    ],
  },
]);
