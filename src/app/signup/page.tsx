import SignupForm from "@/components/signup-form/SignupForm";
import AuthLayout from "@/components/shared/auth-layout/AuthLayout";
import { FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import GoogleSignupButton from "./GoogleSignupButton";

export const metadata = { title: "Sign up" };

export default function Page() {
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );

  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes less than a minute"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-main-color hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      {googleEnabled && (
        <>
          <GoogleSignupButton icon={<FaGoogle className="h-4 w-4 text-red-600 dark:text-red-300" />} />
          <p className="my-5 text-muted-foreground text-center text-sm">or sign up with email</p>
        </>
      )}
      <SignupForm />
    </AuthLayout>
  );
}
