"use server";

import { z } from "zod";

import { createUser, getUser } from "@/lib/db/queries";

import { signIn, registerUser } from "./auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
}

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export interface RegisterActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
}

export async function register(
  prevState: RegisterActionState,
  formData: FormData
) {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    console.log("Starting registration process...");

    try {
      await registerUser(validatedData.email, validatedData.password);
    } catch (regError) {
      console.error("Firebase registration error:", regError);
      throw regError;
    }

    console.log("Registration successful, attempting sign in...");

    try {
      await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
      });
    } catch (signInError) {
      console.error("Sign in error:", signInError);
      throw signInError;
    }

    return { status: "success" };
  } catch (error: any) {
    console.error("Registration error details:", {
      code: error.code,
      message: error.message,
      fullError: error,
    });

    if (error.code === "auth/email-already-in-use") {
      return { status: "user_exists" };
    }
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }
    return { status: "failed" };
  }
}
