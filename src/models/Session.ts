import { UserDTO } from './User';

// Sessions are only created when the user accepts cookies
// They are used to track user activity for analytics and events

export interface SessionAttributes {
  id: number;
  sessionId: string; // stored in cookie
  userId?: number | null; // nullable until login
  createdAt: Date;
}

export interface SessionDTO {
  id: number;
  sessionId: string;
  userId?: number;
  user?: UserDTO;
  createdAt: Date;
}
