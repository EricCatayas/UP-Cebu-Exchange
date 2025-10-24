export interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  status: "Active" | "Pending" | "Inactive" | "Banned";
  createdAt: Date;
  roleId: number;
}
