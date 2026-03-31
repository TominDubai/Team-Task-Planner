import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminClient from "./AdminClient";
import type { Profile, Task } from "@/lib/types";
import { ensureProfile } from "@/lib/supabase/ensure-profile";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { profile } = await ensureProfile(supabase, user);
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const [{ data: profiles }, { data: tasks }] = await Promise.all([
    supabase.from("profiles").select("*").order("full_name"),
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <AdminClient
      currentUser={profile as Profile}
      initialProfiles={(profiles ?? []) as Profile[]}
      initialTasks={(tasks ?? []) as Task[]}
    />
  );
}
