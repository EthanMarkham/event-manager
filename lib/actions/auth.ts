"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/actions/result";
import { normalizeSupabaseError, zodErrorToFieldErrors } from "@/lib/actions/result";
import { authFormSchema, type AuthFormValues } from "@/lib/validation/auth";

export async function signUpAction(input: AuthFormValues): Promise<ActionResult<void>> {
  const parsed = authFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Validation failed. Please check the form fields.",
      fieldErrors: zodErrorToFieldErrors(parsed.error),
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  if (error) {
    return { ok: false, message: normalizeSupabaseError(error) };
  }

  // If email confirmation is enabled, Supabase won't return a session yet.
  if (!data.session) {
    return {
      ok: true,
      data: undefined,
      message: "Check your email to confirm your account, then sign in.",
    };
  }

  // Session is ready; let the caller decide how to navigate.
  await revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}

export async function signInAction(input: AuthFormValues): Promise<ActionResult<void>> {
  const parsed = authFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Validation failed. Please check the form fields.",
      fieldErrors: zodErrorToFieldErrors(parsed.error),
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { ok: false, message: normalizeSupabaseError(error) };
  }

  await revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}

export async function signOutAction(): Promise<ActionResult<void>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { ok: false, message: normalizeSupabaseError(error) };
  }

  await revalidatePath("/", "layout");
  return { ok: true, data: undefined };
}
