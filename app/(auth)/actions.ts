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
    | "success"
    | "user_exists"
    | "invalid_data"
    | "failed"
    | "in_progress";
}

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Check if user exists
    const existingUser = await getUser(validatedData.email);
    if (existingUser) {
      return { status: "user_exists" };
    }

    // Create the user
    await createUser(validatedData.email, validatedData.password);

    // Sign in the user
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: true,
      callbackUrl: "/",
    });

    return { status: "success" };
  } catch (error: any) {
    console.error("Registration error details:", {
      code: error.code,
      message: error.message,
      fullError: error,
    });

    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
