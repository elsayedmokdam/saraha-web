"use client";

import { Provider } from "react-redux";
import { AppStore, makeStore, RootState } from "@/redux/store/store";
import { SessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { setProfile } from "@/redux/store/slices/userSlice/UserSlice";
import { setPendingCount } from "@/redux/store/slices/requestsSlice/RequestsSlice";
import SessionGuard from "@/components/session-guard/SessionGuard";

interface ProvidersProps {
  children: React.ReactNode;
  preloadedState: Pick<RootState, "user" | "requests">;
  sessionExpired: boolean;
}

export default function Providers({
  children,
  preloadedState,
  sessionExpired,
}: ProvidersProps) {
  // One store per browser session, created lazily (initial state comes from the server layout)
  const [store] = useState<AppStore>(() => makeStore(preloadedState));

  const profile = preloadedState.user.profile;
  const pendingCount = preloadedState.requests.pendingCount;

  // Keep the store in sync when the server re-renders the layout (router.refresh / sign in / sign out)
  useEffect(() => {
    store.dispatch(setProfile(profile));
    store.dispatch(setPendingCount(pendingCount));
  }, [store, profile, pendingCount]);

  return (
    // Poll the session every 5 min: this is what triggers the API token rotation (see nextAuth.config.ts)
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <Provider store={store}>
        <SessionGuard sessionExpired={sessionExpired} />
        {children}
      </Provider>
    </SessionProvider>
  );
}
