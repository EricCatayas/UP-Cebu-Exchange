export interface SessionAttributes {
  id: number;
  sessionId: string; // stored in cookie
  userId?: number; // nullable until login/signup
  createdAt: Date;
  lastSeenAt: Date;
}
