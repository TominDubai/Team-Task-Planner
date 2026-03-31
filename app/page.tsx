import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Avoid calling Supabase during `next build` when env vars are not available (e.g. misconfigured CI). */
export const dynamic = "force-dynamic";

export default async function RootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
