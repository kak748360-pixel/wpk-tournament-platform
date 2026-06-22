import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export async function signUpWithEmail(email: string, password: string, nickname: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
    },
  });

  if (error) throw error;

  if (data.user) {
    await fetch("/api/auth/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: data.user.id,
        email: data.user.email || email,
        nickname: nickname || data.user.email?.split("@")[0] || "player",
      }),
    });
  }

  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}
