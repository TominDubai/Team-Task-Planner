import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

/**
 * Ensures a row exists in public.profiles for this auth user.
 * Requires RLS policy profiles_insert_own (see supabase/schema.sql).
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User
): Promise<{ profile: Profile | null; error?: string }> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return { profile: existing as Profile };

  const fullName =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name.trim()) ||
    user.email?.split("@")[0] ||
    "Team member";

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    full_name: fullName,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      const { data: row } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (row) return { profile: row as Profile };
    }
    return { profile: null, error: insertError.message };
  }

  const { data: created } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { profile: (created as Profile) ?? null };
}
