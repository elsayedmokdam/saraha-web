import type { Gender, Provider, Role } from "./enums";

/**
 * A user as the browser is allowed to see it.
 * The API's raw user documents also contain `password`, `confirmPassword` and an encrypted `phone`:
 * they are stripped by `sanitizeUser()` before leaving the server.
 */
export interface User {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  /** virtual: `${firstName} ${lastName}` */
  username: string;
  email: string;
  confirmEmail?: string;
  isCreated?: boolean;
  DOB?: string;
  image?: string;
  imageCover?: string[];
  gender: Gender;
  role: Role;
  provider: Provider;
  createdAt: string;
  updatedAt: string;
}

const SENSITIVE_FIELDS = [
  "password",
  "confirmPassword",
  "phone",
  "changeCredentialsTime",
  "__v",
] as const;

/** Removes everything that must never reach the browser. Accepts anything the API sends back. */
export function sanitizeUser(raw: any): User {
  const user = { ...(raw ?? {}) };
  for (const field of SENSITIVE_FIELDS) delete user[field];
  return user as User;
}

/** PUT /user/update-data: the API requires username, email and phone on every call */
export interface UpdateUserDataPayload {
  /** "First Last" (one space) */
  username: string;
  email: string;
  phone: string;
  /** ISO date (YYYY-MM-DD) */
  DOB?: string;
  /** 0 = male, 1 = female (JSON number) */
  gender?: 0 | 1;
}

export interface AdminAddUserPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AdminUpdateUserPayload {
  username: string;
  email: string;
}

/** PATCH /user/update-password */
export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
