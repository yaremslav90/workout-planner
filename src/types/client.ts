export type ClientStatus = "active" | "paused";

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  heightCm: number;
  status: ClientStatus;
  weightKg: number;
  goal: string;
  updatedAt: string;
};
