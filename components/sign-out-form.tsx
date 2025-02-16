"use client";

import { signOut } from "@/app/(auth)/auth";
import { Button } from "./ui/button";

export function SignOutForm() {
  return (
    <form
      action={async () => {
        await signOut();
      }}
    >
      <Button variant="ghost" className="w-full justify-start">
        Sign Out
      </Button>
    </form>
  );
}
