import PageHeader from "@/components/shared/page-header/PageHeader";
import IsEmpty from "@/components/shared/is-empty/IsEmpty";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { FiAlertCircle, FiSettings } from "react-icons/fi";
import SettingsView from "./SettingsView";

export const metadata = { title: "Settings" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const response = await $SERVICE_REPOSITORY.Users.getProfile();

  if (!response.ok) {
    return (
      <IsEmpty
        icon={<FiAlertCircle />}
        title="Could not load your settings"
        description={response.error.message}
        links={[{ label: "Sign in again", href: "/signin" }]}
      />
    );
  }

  return (
    <>
      <PageHeader
        icon={<FiSettings />}
        title="Settings"
        subtitle="Manage your account, security and appearance"
      />
      <SettingsView
        user={response.data.data}
        initialTab={tab === "password" || tab === "appearance" ? tab : "profile"}
      />
    </>
  );
}
