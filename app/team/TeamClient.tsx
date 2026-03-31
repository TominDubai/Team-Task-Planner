"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSupabaseBrowser } from "@/hooks/use-supabase-browser";
import type { Profile, Task } from "@/lib/types";
import MemberCard from "@/components/team/MemberCard";
import { Users, Wifi, Search } from "lucide-react";

interface TeamClientProps {
  currentUserId: string;
  initialProfiles: Profile[];
  initialTasks: Task[];
}

export default function TeamClient({ currentUserId, initialProfiles, initialTasks }: TeamClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [liveCount, setLiveCount] = useState(0);
  const supabase = useSupabaseBrowser();

  // ─── Real-time subscriptions ───────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) return;
    // Profiles channel — vibe updates appear instantly
    const profilesChannel = supabase
      .channel("team-profiles")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          setProfiles((prev) =>
            prev.map((p) =>
              p.id === (payload.new as Profile).id ? (payload.new as Profile) : p
            )
          );
          setLiveCount((c) => c + 1);
        }
      )
      .subscribe();

    // Tasks channel — progress rings update when anyone saves progress
    const tasksChannel = supabase
      .channel("team-tasks")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tasks" },
        (payload) => {
          setTasks((prev) => [payload.new as Task, ...prev]);
          setLiveCount((c) => c + 1);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tasks" },
        (payload) => {
          setTasks((prev) =>
            prev.map((t) => (t.id === (payload.new as Task).id ? (payload.new as Task) : t))
          );
          setLiveCount((c) => c + 1);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "tasks" },
        (payload) => {
          setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(tasksChannel);
    };
  }, [supabase]);

  const filteredProfiles = profiles.filter((p) =>
    p.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalAtRisk = tasks.filter((t) => t.status === "at_risk").length;
  const totalComplete = tasks.filter((t) => t.status === "complete").length;
  const totalTasks = tasks.length;
  const teamPct = totalTasks > 0 ? Math.round((totalComplete / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen px-8 py-8">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <p className="section-label mb-1">Collective Pulse</p>
            <h1 className="page-title">Team Overview</h1>
            <p className="font-body text-sm text-white/35 mt-1">
              {profiles.length} members · Live progress
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 border border-white/[0.08]"
              style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="relative w-2 h-2">
                <div className="absolute inset-0 rounded-full bg-[#00e5a0] animate-ping opacity-40" />
                <div className="relative w-2 h-2 rounded-full bg-[#00e5a0]" />
              </div>
              <Wifi className="w-3 h-3 text-white/30" />
              <span className="font-body text-xs text-white/40">Live</span>
              {liveCount > 0 && (
                <motion.span
                  key={liveCount}
                  initial={{ scale: 1.4, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-mono text-[10px] text-[#00e5a0]"
                >
                  +{liveCount}
                </motion.span>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
              <input
                type="text"
                placeholder="Search team..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl text-sm font-body text-white/70 placeholder-white/25 outline-none border border-white/[0.08] focus:border-[#00b4ff]/40 transition-colors w-40"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Team stats bar */}
        <motion.div
          initial={{ opacity: 1, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card p-5 mb-8"
        >
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-white/30" />
              <div>
                <p className="font-body text-xs text-white/35">Team</p>
                <p className="font-display font-bold text-xl text-white leading-tight">
                  {profiles.length} <span className="text-white/30 text-sm font-medium">members</span>
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body text-xs text-white/35">Overall team completion</span>
                <span className="font-display font-bold text-sm text-[#00b4ff]">{teamPct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${teamPct}%` }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: "linear-gradient(90deg, #00b4ff, #00e5a0)",
                    boxShadow: "0 0 8px rgba(0,180,255,0.4)",
                  }}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <p className="font-display font-bold text-lg text-[#00e5a0] leading-tight">{totalComplete}</p>
                <p className="font-body text-[10px] text-white/25 uppercase tracking-wider">Done</p>
              </div>
              {totalAtRisk > 0 && (
                <div className="text-center">
                  <p className="font-display font-bold text-lg text-[#ff4d6a] leading-tight">{totalAtRisk}</p>
                  <p className="font-body text-[10px] text-white/25 uppercase tracking-wider">At Risk</p>
                </div>
              )}
              <div className="text-center">
                <p className="font-display font-bold text-lg text-white/60 leading-tight">{totalTasks}</p>
                <p className="font-body text-[10px] text-white/25 uppercase tracking-wider">Total</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Member grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-sm text-white/25">No members match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProfiles.map((profile, i) => (
              <MemberCard
                key={profile.id}
                profile={profile}
                tasks={tasks.filter((t) => t.user_id === profile.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
