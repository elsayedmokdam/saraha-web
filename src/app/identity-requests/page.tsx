import PageHeader from "@/components/shared/page-header/PageHeader";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { FiUserCheck } from "react-icons/fi";
import IdentityRequestsList from "./IdentityRequestsList";

export const metadata = { title: "Identity requests" };
const LIMIT = 10;

export default async function Page() {
  const response = await $SERVICE_REPOSITORY.IdentityRequests.getIdentityRequests({
    page: "1",
    limit: String(LIMIT),
  });

  return (
    <>
      <PageHeader
        icon={<FiUserCheck className="size-6" />}
        title="Identity requests"
        subtitle="People asking who wrote their message"
      />
      <IdentityRequestsList
        initialRequests={response.ok ? response.data.data.data : []}
        initialError={response.ok ? undefined : response.error.message}
        limit={LIMIT}
      />
    </>
  );
}
