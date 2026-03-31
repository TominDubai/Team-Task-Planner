import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";
import type { Profile } from "@/lib/types";
import { ensureProfile } from "@/lib/supabase/ensure-profile";

export default async function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { profile, error: profileError } = await ensureProfile(supabase, user);

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-8">
        <div className="max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8 text-center">
          <h1 className="font-display text-lg font-bold text-white mb-2">
            Profile could not be loaded
          </h1>
          <p className="font-body text-sm text-white/45 mb-4">
            {profileError ||
              "Your account has no profile row yet. Add the profiles INSERT policy in Supabase (see schema.sql) or run the SQL below."}
          </p>
          <pre className="text-left text-[11px] text-white/35 bg-black/40 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
            {`create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#121212] bg-grid">
      <Sidebar profile={profile as Profile} />
      <main className="flex-1 ml-[240px] min-h-screen overflow-x-hidden relative z-[1]">
        {children}
      </main>
    </div>
  );
}
