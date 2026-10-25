import type { Metadata } from "next";
import { Exo } from "next/font/google";
import "./globals.css";
import React from "react";
import AppShell, { Viewer } from "@/components/app-shell/AppShell";
import ThemeProvider from "@/components/theme/ThemeProvider";
import { Toaster } from "react-hot-toast";
import Providers from "./_providers/Providers";
import { getMyToken } from "@/services/utils/helpers/getMyToken";
import $SERVICE_REPOSITORY from "@/services/service.repo";
import { IdentityRequestStatusEnum } from "@/services/types/enums";

const exo = Exo({
  variable: "--font-exo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Saraha",
    template: "%s | Saraha",
  },
  description: "Send and receive honest anonymous messages.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let profile = null;
  let pendingCount = 0;
  let viewer: Viewer | null = null;
  let sessionExpired = false;

  // Only for signed-in users: load the profile + how many identity requests wait for an answer
  const token = await getMyToken();
  if (token) {
    // read from the session cookie (no API call): enough to render the shell without a flash
    viewer = {
      id: token.userId ?? "",
      name: (token.name as string) ?? "",
      email: (token.email as string) ?? "",
      image: (token.picture as string | undefined) ?? null,
      role: token.role ?? 0,
    };

    const [profileResponse, requestsResponse] = await Promise.all([
      $SERVICE_REPOSITORY.Users.getProfile(),
      $SERVICE_REPOSITORY.IdentityRequests.getIdentityRequests({
        page: "1",
        limit: "50",
      }),
    ]);

    profile = profileResponse.ok ? profileResponse.data.data : null;
    sessionExpired =
      !profileResponse.ok && profileResponse.error.status === 401;
    pendingCount = requestsResponse.ok
      ? requestsResponse.data.data.data.filter(
          (r) => r.status === IdentityRequestStatusEnum.PENDING,
        ).length
      : 0;
  }

  // Initial Redux state
  const preloadedState = {
    user: { profile },
    requests: { pendingCount },
  };

  return (
    <html lang="en" className={`${exo.variable}`} suppressHydrationWarning>
      <body>
        {/* Client Boundary Pattern */}
        <ThemeProvider>
          <Providers
            preloadedState={preloadedState}
            sessionExpired={sessionExpired}
          >
            <AppShell viewer={viewer}>{children}</AppShell>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "var(--popover)",
                  color: "var(--popover-foreground)",
                  border: "1px solid var(--border)",
                },
              }}
            />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
