import $SERVICE_REPOSITORY from "@/services/service.repo";
import { ROTATE_WINDOW_MS } from "@/services/config";
import { TokenPair } from "@/services/types/auth_interface";
import { decodeJwt, getJwtExpiry } from "@/services/utils/helpers/jwt";
import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

const GOOGLE_ENABLED = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

/**
 * Turns the API token pair into the user object NextAuth keeps in the session cookie.
 * The profile is fetched with the fresh access token (the session cookie does not exist yet).
 */
async function buildUser(tokens: TokenPair): Promise<NextAuthUser> {
  const profile = await $SERVICE_REPOSITORY.Users.getProfile(tokens.access_token);

  if (!profile.ok) throw new Error(profile.error.message);

  const user = profile.data.data;
  return {
    id: user._id,
    name: user.username,
    email: user.email,
    image: user.image ?? null,
    role: user.role,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  };
}

/** Exchanges the refresh token for a new pair (POST /user/rotate-token). */
async function rotateTokens(token: JWT): Promise<JWT> {
  if (!token.refreshToken) return { ...token, error: "MissingRefreshToken" };

  const res = await $SERVICE_REPOSITORY.Users.rotateToken(token.refreshToken);

  if (!res.ok) {
    // 409 => the access token is still valid (the API only rotates during its last 10 minutes)
    if (res.error.status === 409) return { ...token, rotateStatus: "still-valid" };
    // Network problem / API down / rate limited => keep the session and retry on the next poll
    if (
      res.error.status === 0 ||
      res.error.status === 408 ||
      res.error.status === 429 ||
      res.error.status >= 500
    ) {
      return token;
    }
    // 400 / 401 => the refresh token was revoked or expired: the user must sign in again
    return { ...token, error: "RotateTokenError" };
  }

  const { access_token, refresh_token } = res.data.data;

  // Safety net: a rotated access token WITHOUT a `sub` claim is rejected by the API on every request
  // ("Missing Token Payload"). Treat it as a failed rotation instead of keeping a broken session.
  if (!decodeJwt(access_token)?.sub) {
    return { ...token, error: "RotateTokenInvalid" };
  }

  return {
    ...token,
    accessToken: access_token,
    refreshToken: refresh_token,
    accessTokenExpires: getJwtExpiry(access_token),
    rotatedAt: Date.now(),
    rotateStatus: "rotated",
    error: undefined,
  };
}

export const nextAuthConfig: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password" },
        // two-step verification
        otp: { label: "OTP", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email?.trim();
        if (!email) throw new Error("Email is required");

        // Throwing here is how the API's message ("Please Confirm Email First to Login", "Invalid Login Credentials",
        // "...try again after 5 minutes") reaches the sign-in form: `signIn(..., { redirect:false })` returns it as `error`.
        const response =
          credentials?.mode === "2fa"
            ? await $SERVICE_REPOSITORY.Auth.verify2FALogin({
                email,
                otp: credentials?.otp ?? "",
              })
            : await $SERVICE_REPOSITORY.Auth.login({
                email,
                password: credentials?.password ?? "",
              });

        if (!response.ok) {
          throw new Error(
            response.error.issues?.[0] ?? response.error.message,
          );
        }

        return buildUser(response.data.data);
      },
    }),

    ...(GOOGLE_ENABLED
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: { params: { prompt: "select_account" } },
          }),
        ]
      : []),
  ],

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days (the API's refresh token lives much longer)
  },

  callbacks: {
    // Google: the API verifies the Google ID token itself (POST /auth/signup-with-gmail signs up OR logs in)
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      if (!account.id_token) {
        return `/signin?error=${encodeURIComponent("Google did not return an ID token")}`;
      }

      const response = await $SERVICE_REPOSITORY.Auth.signupWithGmail({
        idToken: account.id_token,
      });

      if (!response.ok) {
        return `/signin?error=${encodeURIComponent(response.error.message)}`;
      }

      try {
        // `user` is the same object NextAuth hands to the `jwt` callback below
        Object.assign(user, await buildUser(response.data.data));
      } catch (error) {
        return `/signin?error=${encodeURIComponent(
          error instanceof Error ? error.message : "Google sign-in failed",
        )}`;
      }
      return true;
    },

    // Runs on every sign-in and every session read (`useSession`, `/api/auth/session`, `update()`).
    async jwt({ token, user, account, trigger, session }) {
      // 1) First sign-in: keep the API tokens inside the (encrypted, httpOnly) cookie
      if (user?.accessToken && user.refreshToken) {
        return {
          ...token,
          userId: user.id,
          role: user.role,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: getJwtExpiry(user.accessToken),
          rotatedAt: undefined,
          rotateStatus: undefined,
          error: undefined,
        };
      }

      // Defensive: Google sign-in where `signIn` could not hand the tokens over
      if (account?.provider === "google" && account.id_token && !token.accessToken) {
        const response = await $SERVICE_REPOSITORY.Auth.signupWithGmail({
          idToken: account.id_token,
        });
        if (response.ok) {
          const built = await buildUser(response.data.data);
          return {
            ...token,
            userId: built.id,
            role: built.role,
            accessToken: built.accessToken,
            refreshToken: built.refreshToken,
            accessTokenExpires: getJwtExpiry(built.accessToken),
          };
        }
        return { ...token, error: "OAuthBackendError" };
      }

      // 2) Already signed in
      token.rotateStatus = undefined;
      if (token.error || !token.refreshToken) return token;

      // 2.0) the profile was edited (Settings): re-read name / email / avatar into the cookie
      if (trigger === "update" && session?.action === "profile") {
        const profile = await $SERVICE_REPOSITORY.Users.getProfile(token.accessToken);
        if (profile.ok) {
          token.name = profile.data.data.username;
          token.email = profile.data.data.email;
          token.picture = profile.data.data.image ?? null;
        }
        return token;
      }

      // 2a) the user asked to refresh the session now (Profile > Session > "Refresh now")
      if (trigger === "update" && session?.action === "rotate") {
        return rotateTokens(token);
      }

      // 2b) automatic: the API allows rotation during the last 10 minutes of the access token
      if (
        token.accessTokenExpires &&
        Date.now() >= token.accessTokenExpires - ROTATE_WINDOW_MS
      ) {
        return rotateTokens(token);
      }

      return token;
    },

    // Whatever is returned here is readable in the browser (`useSession`): never put the API tokens in it.
    async session({ session, token }) {
      session.user = {
        id: token.userId ?? token.sub ?? "",
        name: (token.name as string) ?? "",
        email: (token.email as string) ?? "",
        image: (token.picture as string | undefined) ?? null,
        role: token.role ?? 0,
      };
      session.accessTokenExpires = token.accessTokenExpires;
      session.rotatedAt = token.rotatedAt;
      session.rotateStatus = token.rotateStatus;
      session.error = token.error;
      return session;
    },
  },
};
