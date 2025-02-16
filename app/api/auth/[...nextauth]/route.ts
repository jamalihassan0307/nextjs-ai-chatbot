import NextAuth from "next-auth";
import { authConfig } from "@/app/(auth)/auth.config";

const auth = NextAuth(authConfig);

// Export auth.handlers which contains the GET and POST functions
export const { GET, POST } = auth.handlers;
