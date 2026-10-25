import type { IdentityRequestStatus } from "./enums";

export interface Message {
  _id: string;
  id?: string;
  content?: string;
  /** server paths such as `./assets/message/<uuid>.png` -> use `assetUrl()` */
  attachment: string[];
  senderId?: string;
  receiverId: string;
  /** becomes `false` once an identity request was accepted */
  isAnonymous: boolean;
  requestStatus: IdentityRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IdentityRequest {
  _id: string;
  messageId: string;
  receiverId: string;
  status: IdentityRequestStatus;
  conversationId?: string;
  createdAt: string;
  updatedAt: string;
  /** `$lookup` result: an array with the related message */
  message?: Partial<Message>[];
}

export interface IdentityRequestWithSenderReceiver {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string | null;
  DOB?: string;
  image?: string;
  imageCover?: string[];
  gender: string;
  role: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  identifyRequestId: string;
  messageId: string;
  sender: IdentityRequestWithSenderReceiver;
  receiver: IdentityRequestWithSenderReceiver;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachment: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RespondIdentityRequestResult {
  request: IdentityRequest;
  /** only present when the request was accepted */
  conversation?: Conversation;
}

export interface DeleteResult {
  acknowledged: boolean;
  deletedCount: number;
}
