import ConfirmEmailForm from "@/components/confirm-email-form/ConfirmEmailForm";
import AuthLayout from "@/components/shared/auth-layout/AuthLayout";
import Link from "next/link";

export const metadata = { title: "Confirm your email" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <AuthLayout
      title="Confirm your email"
      subtitle="We sent a 6-digit code to your inbox"
      footer={
        <>
          Already confirmed?{" "}
          <Link href="/signin" className="font-semibold text-main-color hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <ConfirmEmailForm defaultEmail={email} />
    </AuthLayout>
  );
}
