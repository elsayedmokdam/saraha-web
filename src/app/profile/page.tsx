import PageHeader from "@/components/shared/page-header/PageHeader";
import IsEmpty from "@/components/shared/is-empty/IsEmpty";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { FaUser } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import ProfileView from "./ProfileView";

export const metadata = { title: "Profile" };

export default async function Page() {
  const response = await $SERVICE_REPOSITORY.Users.getProfile();

  if (!response.ok) {
    return (
      <IsEmpty
        icon={<FiAlertCircle />}
        title="Could not load your profile"
        description={response.error.message}
        links={[{ label: "Sign in again", href: "/signin" }]}
      />
    );
  }

  return (
    <>
      <PageHeader
        icon={<FaUser className="size-6" />}
        title="My profile"
        subtitle="Your account, link and security"
        actions={
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-xl bg-main-color px-4 py-2 text-sm font-semibold text-white hover:bg-main-color/90"
          >
            <FiSettings /> <span className="hidden sm:inline">Edit</span>
          </Link>
        }
      />
      <ProfileView user={response.data.data} />
    </>
  );
}
