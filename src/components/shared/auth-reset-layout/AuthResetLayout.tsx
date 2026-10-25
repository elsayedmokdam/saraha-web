import Link from "next/link";
import { MdEmail } from "react-icons/md";
import { FaShieldAlt, FaLock, FaKey, FaCheck, FaArrowLeft } from "react-icons/fa";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const circle = (step: number) =>
    `w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition ${
      currentStep >= step
        ? "bg-main-color text-white"
        : "bg-muted text-muted-foreground/70"
    }`;
  const line = (step: number) =>
    `w-12 h-0.5 ${currentStep >= step ? "bg-main-color" : "bg-muted"}`;

  return (
    <div className="flex items-center justify-center gap-2 my-6">
      {/* Step 1: Email */}
      <div className={circle(1)}>
        {currentStep > 1 ? <FaCheck className="size-4" /> : <MdEmail className="size-4" />}
      </div>
      <div className={line(2)} />
      {/* Step 2: Code */}
      <div className={circle(2)}>
        {currentStep > 2 ? <FaCheck className="size-4" /> : <FaKey className="size-3.5" />}
      </div>
      <div className={line(3)} />
      {/* Step 3: Password */}
      <div className={circle(3)}>
        <FaLock className="size-3.5" />
      </div>
    </div>
  );
};

interface AuthResetLayoutProps {
  step: 1 | 2 | 3;
  title: string;
  subtitle: string | React.ReactNode;
  children: React.ReactNode;
  backAction?: { label: string; onClick?: () => void; href?: string };
  footerText?: React.ReactNode;
}

export default function AuthResetLayout({
  step,
  title,
  subtitle,
  children,
  backAction,
  footerText,
}: AuthResetLayoutProps) {
  const backClass =
    "inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-main-color transition";

  return (
    <div className="min-h-[calc(100dvh-4rem)] w-full flex items-center justify-center bg-muted/50 p-4 sm:p-8">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side Banner */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center">
          <div className="size-64 rounded-full bg-linear-to-br from-main-color to-fuchsia-500 flex items-center justify-center shadow-xl">
            <FaKey className="size-24 text-white/90" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mt-8">
            Reset Your Password
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Don&apos;t worry, it happens to the best of us. We&apos;ll help you
            get back into your account in no time.
          </p>
          <div className="flex items-center gap-6 mt-6 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <MdEmail className="text-main-color size-4" /> Email Verification
            </span>
            <span className="flex items-center gap-1.5">
              <FaShieldAlt className="text-main-color size-3.5" /> Secure Reset
            </span>
          </div>
        </div>

        {/* Right Side Card */}
        <div className="bg-card rounded-3xl p-8 sm:p-10 shadow-lg border border-border w-full max-w-lg mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-main-color tracking-tight">
              Sara<span className="text-foreground">ha</span>
            </h1>
            <h2 className="text-xl font-bold text-foreground mt-3">{title}</h2>
            <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>
          </div>

          <StepIndicator currentStep={step} />

          {children}

          {backAction && (
            <div className="mt-4 text-center">
              {backAction.href ? (
                <Link href={backAction.href} className={backClass}>
                  <FaArrowLeft className="size-3" /> {backAction.label}
                </Link>
              ) : (
                <button type="button" onClick={backAction.onClick} className={backClass}>
                  <FaArrowLeft className="size-3" /> {backAction.label}
                </button>
              )}
            </div>
          )}

          {footerText && (
            <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
              {footerText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
