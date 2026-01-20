"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { authFormSchema, AUTH_ERROR_OAUTH_FAILED, type AuthFormValues } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "@/lib/ui/icons";
import { AuthLoginHeader } from "./auth-login-header";
import { AuthLoginToggle } from "./auth-login-toggle";
import { signInAction, signUpAction } from "@/lib/actions/auth";
import { applyServerFieldErrors } from "@/lib/forms/apply-server-field-errors";
import { toast } from "@/lib/notifications/toast";
import { getBrowserClient } from "@/lib/supabase/client";

type AuthLoginFormProps = {
  initialError?: string;
};

export function AuthLoginForm({
  initialError,
}: AuthLoginFormProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [signUpNotice, setSignUpNotice] = useState<string | null>(null);
  const [isGooglePending, startGoogleTransition] = useTransition();
  const lastShownErrorRef = useRef<string | undefined>(undefined);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (initialError === AUTH_ERROR_OAUTH_FAILED && lastShownErrorRef.current !== initialError) {
      lastShownErrorRef.current = initialError;
      toast.error("OAuth authentication failed. Please try again.");
    }
  }, [initialError]);

  const handleEmailSubmit: SubmitHandler<AuthFormValues> = async (data) => {
    setSignUpNotice(null);
    const result = await (isSignUp ? signUpAction(data) : signInAction(data));

    if (!result.ok) {
      if (result.fieldErrors) {
        applyServerFieldErrors(form.setError, result.fieldErrors);
      } else {
        toast.error(result.message);
      }
      return;
    }

    if (isSignUp && result.message) {
      // For confirmed-email signups, show the notice and keep user on the page.
      setSignUpNotice(result.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const isBusy = form.formState.isSubmitting || Boolean(isGooglePending);

  function handleGoogleSignIn() {
    startGoogleTransition(async () => {
      const supabase = getBrowserClient();
      const siteUrl = window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }
    });
  }

  return (
    <Card className="border-border/60 bg-card/75 shadow-xl shadow-primary/10 backdrop-blur-xl">
      <AuthLoginHeader isSignUp={isSignUp} />
      <CardContent className="space-y-4">
        {signUpNotice && (
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
            {signUpNotice}
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEmailSubmit)}
            className="space-y-4"
            aria-busy={isBusy}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={isBusy}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                      disabled={isBusy}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Minimum 6 characters</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isBusy}
        >
          {isGooglePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Image
            src="/google.svg"
            alt=""
            aria-hidden="true"
            className="mr-2 h-4 w-4"
            width={16}
            height={16}
          />
          Continue with Google
        </Button>

        <AuthLoginToggle
          isSignUp={isSignUp}
          isBusy={isBusy}
          onToggle={() => {
            setIsSignUp(!isSignUp);
            setSignUpNotice(null);
            form.clearErrors();
          }}
        />
      </CardContent>
    </Card>
  );
}
