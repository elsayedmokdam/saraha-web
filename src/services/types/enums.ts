// Mirrors `src/common/enum/*` of the API.
export const RoleEnum = { USER: 0, ADMIN: 1 } as const;
export const GenderEnum = { MALE: 0, FEMALE: 1 } as const;
export const ProviderEnum = { SYSTEM: 0, GOOGLE: 1 } as const;
export const LogoutEnum = { ONE: 0, ALL: 1 } as const;
export const MessageTypeEnum = {
  /** messages I sent */
  SENDER: "0",
  /** messages I received */
  RECEIVER: "1",
  /** both */
  BOTH: "2",
} as const;
export const IdentityRequestStatusEnum = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  NOTASKED: "notasked",
} as const;

export type Role = (typeof RoleEnum)[keyof typeof RoleEnum];
export type Gender = (typeof GenderEnum)[keyof typeof GenderEnum];
export type Provider = (typeof ProviderEnum)[keyof typeof ProviderEnum];
export type LogoutAction = (typeof LogoutEnum)[keyof typeof LogoutEnum];
export type MessageType = (typeof MessageTypeEnum)[keyof typeof MessageTypeEnum];
export type IdentityRequestStatus =
  (typeof IdentityRequestStatusEnum)[keyof typeof IdentityRequestStatusEnum];
