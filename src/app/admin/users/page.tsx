import IsEmpty from "@/components/shared/is-empty/IsEmpty";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { FiShieldOff } from "react-icons/fi";
import UsersTable from "./UsersTable";

export const metadata = { title: "Users · Admin" };

/** Rows per page (the table asks for the following pages with the same size). */
const LIMIT = 10;

export default async function Page() {
  const response = await $SERVICE_REPOSITORY.Users.getAllUsers({
    page: "1",
    limit: String(LIMIT),
  });

  if (!response.ok) {
    return (
      <IsEmpty
        icon={<FiShieldOff />}
        title={
          response.error.status === 403 ? "Admins only" : "Could not load users"
        }
        description={response.error.message}
        links={[{ label: "Back to Home", href: "/" }]}
      />
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground">Users</h1>
      <p className="mt-2 mb-6 text-sm text-foreground">
        Every registered user except you.
      </p>
      <UsersTable users={response.data.data} />
    </div>
  );
}
