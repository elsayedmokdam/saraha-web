import { createIdentityRequestService } from "./createIdentityRequest.service";
import { respondToIdentityRequestService } from "./respondToIdentityRequest.service";
import { getIdentityRequestsService } from "./getIdentityRequests.service";

export const IdentityRequestsRepo = {
  createIdentityRequest: createIdentityRequestService,
  respondToIdentityRequest: respondToIdentityRequestService,
  getIdentityRequests: getIdentityRequestsService,
};
