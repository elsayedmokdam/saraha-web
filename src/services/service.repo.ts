import { SystemRepo } from "./system/system.repo";
import { AuthRepo } from "./auth/auth.repo";
import { UsersRepo } from "./users/users.repo";
import { MessagesRepo } from "./messages/messages.repo";
import { IdentityRequestsRepo } from "./identityRequests/identityRequests.repo";
import { ConversationsRepo } from "./conversations/conversations.repo";

export const $SERVICE_REPOSITORY = {
  System: SystemRepo,
  Auth: AuthRepo,
  Users: UsersRepo,
  Messages: MessagesRepo,
  IdentityRequests: IdentityRequestsRepo,
  Conversations: ConversationsRepo,
};

export default $SERVICE_REPOSITORY;
