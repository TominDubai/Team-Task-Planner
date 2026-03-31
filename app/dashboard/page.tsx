import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { ensureProfile } from "@/lib/supabase/ensure-profile";

/** Do not prerender at build time (needs cookies + Supabase; avoids Vercel build without env). */
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { profile } = await ensureProfile(supabase, user);
  if (!profile) redirect("/auth/login");

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <DashboardClient profile={profile} initialTasks={tasks ?? []} />;
}
