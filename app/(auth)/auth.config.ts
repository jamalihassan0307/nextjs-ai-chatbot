import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: [], // Will be configured in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuth =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

      if (isOnAuth) {
        if (isLoggedIn) {
          const callbackUrl = nextUrl.searchParams.get("callbackUrl");
          return Response.redirect(new URL(callbackUrl || "/", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && !nextUrl.pathname.startsWith("/api")) {
        const searchParams = new URLSearchParams({
          callbackUrl: nextUrl.pathname,
        });
        return Response.redirect(new URL(`/login?${searchParams}`, nextUrl));
      }

      return true;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
