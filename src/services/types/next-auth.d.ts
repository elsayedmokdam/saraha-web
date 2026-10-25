import "next-auth";
import "next-auth/jwt";

// Extend the default NextAuth types to include our custom properties (Module augmentation)
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      /** 0 = user, 1 = admin */
      role: number;
    };
    /** unix ms: when the API access token stops being valid */
    accessTokenExpires?: number;
    /** unix ms: set every time the tokens were rotated */
    rotatedAt?: number;
    rotateStatus?: "rotated" | "still-valid";
    /** set when the API session can no longer be used -> the client signs out */
    error?: string;
  }

  interface User {
    id: string;
    role?: number;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** API tokens: they live ONLY in the httpOnly session cookie, never in the browser's JS */
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    userId?: string;
    role?: number;
    rotatedAt?: number;
    rotateStatus?: "rotated" | "still-valid";
    error?: string;
  }
}
