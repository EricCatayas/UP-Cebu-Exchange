import { UserDTO } from './User';

export interface SessionAttributes {
  id: number;
  sessionId: string; // stored in cookie
  userId?: number; // nullable until login
  createdAt: Date;
}

export interface SessionDTO {
  id: number;
  sessionId: string;
  userId?: number;
  user?: UserDTO;
  createdAt: Date;
}
