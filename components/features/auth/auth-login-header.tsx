"use client";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthLoginHeaderProps = {
  isSignUp: boolean;
};

export function AuthLoginHeader({ isSignUp }: AuthLoginHeaderProps) {
  return (
    <CardHeader className="text-center">
      <CardTitle className="text-2xl">{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
      <CardDescription>
        {isSignUp
          ? "Enter your details to create your account"
          : "Enter your credentials to access your dashboard"}
      </CardDescription>
    </CardHeader>
  );
}
