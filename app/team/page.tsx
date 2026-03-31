import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TeamClient from "./TeamClient";
import type { Profile, Task } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const [{ data: profiles }, { data: tasks }] = await Promise.all([
    supabase.from("profiles").select("*").order("full_name"),
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <TeamClient
      currentUserId={user.id}
      initialProfiles={(profiles ?? []) as Profile[]}
      initialTasks={(tasks ?? []) as Task[]}
    />
  );
}
