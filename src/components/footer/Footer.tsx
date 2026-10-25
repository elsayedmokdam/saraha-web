import Link from "next/link";
import ApiStatus from "../api-status/ApiStatus";

/** Public pages only (signed-in users get the app shell without a footer). */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
        <div>
          <p className="text-lg font-bold text-foreground">
            <span className="text-main-color">Sara</span>ha
          </p>
          <p className="text-xs text-muted-foreground">Honest messages. Optional identities.</p>
        </div>

        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-main-color">Home</Link>
          <Link href="/signin" className="hover:text-main-color">Sign in</Link>
          <Link href="/signup" className="hover:text-main-color">Sign up</Link>
        </nav>

        <ApiStatus />
      </div>
    </footer>
  );
}
