import * as zod from "zod";
import { messageContentRule, objectIdRule } from "./common";

// content is optional when images are attached (checked in the form), but must be 3+ chars when present
export const sendMessageSchemaValidation = zod.object({
  receiverId: objectIdRule,
  content: messageContentRule.refine(
    (v) => v.trim().length === 0 || v.trim().length >= 3,
    "Message must be at least 3 characters",
  ),
});

// the conversation model requires text
export const conversationMessageSchemaValidation = zod.object({
  content: messageContentRule
    .trim()
    .min(3, "Message must be at least 3 characters"),
});

