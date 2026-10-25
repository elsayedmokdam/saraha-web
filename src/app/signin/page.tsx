import SigninForm from "@/components/signin-form/SigninForm";
import AuthLayout from "@/components/shared/auth-layout/AuthLayout";
import Link from "next/link";

export const metadata = { title: "Sign in" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; email?: string }>;
}) {
  const { callbackUrl, error, email } = await searchParams;

  // NextAuth sends its own error codes (e.g. "CredentialsSignin"); API messages arrive as free text
  const initialError =
    error && !/^[A-Z][A-Za-z]+$/.test(error) ? error : error ? "Sign in failed. Please try again." : undefined;

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="Sign in to read your messages"
      footer={
        <>
          New to Saraha?{" "}
          <Link href="/signup" className="font-semibold text-main-color hover:underline">
            Sign Up
          </Link>
        </>
      }
    >
      <SigninForm
        callbackUrl={callbackUrl}
        initialError={initialError}
        defaultEmail={email}
        googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)}
      />
    </AuthLayout>
  );
}
