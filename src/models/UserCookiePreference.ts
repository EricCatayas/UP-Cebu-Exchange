export type CookiePreferenceValue = 'accept' | 'reject';

export interface UserCookiePreferenceAttributes {
  id: number;
  userId: number;
  preference: CookiePreferenceValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCookiePreferenceDTO {
  id: number;
  userId: number;
  preference: CookiePreferenceValue;
  createdAt: Date;
  updatedAt: Date;
}
