"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Task, Timeframe } from "@/lib/types";
import { formatPercent, avatarUrl } from "@/lib/utils";
import TaskColumn from "@/components/dashboard/TaskColumn";
import VibeCheck from "@/components/ui/VibeCheck";
import TaskFormModal from "@/components/ui/TaskFormModal";
import ProgressRing from "@/components/ui/ProgressRing";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const TIMEFRAMES: Timeframe[] = ["daily", "weekly", "monthly"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* Keep opacity: 1 in "hidden" so SSR / no-JS never shows a blank screen */
const itemVariants = {
  hidden: { opacity: 1, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

interface DashboardClientProps {
  profile: Profile;
  initialTasks: Task[];
}

export default function DashboardClient({ profile, initialTasks }: DashboardClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultTimeframe, setDefaultTimeframe] = useState<Timeframe>("weekly");
  const supabase = createClient();

  // Real-time subscription for own tasks
  useEffect(() => {
    const channel = supabase
      .channel("own-tasks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `user_id=eq.${profile.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => [payload.new as Task, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((t) => (t.id === (payload.new as Task).id ? (payload.new as Task) : t))
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabase, profile.id]);

  const tasksByTimeframe = (tf: Timeframe) => tasks.filter((t) => t.timeframe === tf);

  const overallPct = (() => {
    if (tasks.length === 0) return 0;
    const total = tasks.reduce((sum, t) => sum + formatPercent(t.actual_value, t.target_value), 0);
    return Math.round(total / tasks.length);
  })();

  const handleDelete = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const handleUpdate = (updated: Task) =>
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

  const openModal = (tf: Timeframe) => {
    setDefaultTimeframe(tf);
    setModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[1280px] mx-auto"
        >
          {/* Page header */}
          <motion.div variants={itemVariants} className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 flex-shrink-0">
                  <Image
                    src={profile.avatar_url || avatarUrl(profile.full_name)}
                    alt={profile.full_name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 text-base leading-none">
                  {profile.current_vibe}
                </span>
              </div>
              <div>
                <p className="section-label mb-1">My Space</p>
                <h1 className="page-title">
                  {profile.full_name.split(" ")[0]}&apos;s Targets
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Overall ring */}
              <div className="flex flex-col items-center gap-1">
                <ProgressRing pct={overallPct} size={56} strokeWidth={4} label={`${overallPct}%`} />
                <span className="section-label text-[9px]">Overall</span>
              </div>
              {/* Vibe check */}
              <VibeCheck currentVibe={profile.current_vibe} userId={profile.id} />
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-8">
            {TIMEFRAMES.map((tf) => {
              const tfTasks = tasksByTimeframe(tf);
              const completed = tfTasks.filter((t) => t.status === "complete").length;
              const atRisk = tfTasks.filter((t) => t.status === "at_risk").length;
              const avgPct =
                tfTasks.length > 0
                  ? Math.round(
                      tfTasks.reduce((s, t) => s + formatPercent(t.actual_value, t.target_value), 0) /
                        tfTasks.length
                    )
                  : 0;

              const colors: Record<Timeframe, string> = {
                daily: "#00b4ff",
                weekly: "#00e5a0",
                monthly: "#f5a623",
              };
              const labels: Record<Timeframe, string> = {
                daily: "Today",
                weekly: "This Week",
                monthly: "This Month",
              };

              return (
                <div key={tf} className="glass-card p-4 flex items-center gap-4">
                  <ProgressRing pct={avgPct} size={44} strokeWidth={4} animated />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-white/40">{labels[tf]}</p>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-display font-bold text-lg leading-none" style={{ color: colors[tf] }}>
                        {avgPct}%
                      </span>
                      <span className="font-body text-xs text-white/25">avg</span>
                    </div>
                    <div className="flex gap-3 mt-1">
                      <span className="font-body text-[10px] text-[#00e5a0]">{completed} done</span>
                      {atRisk > 0 && (
                        <span className="font-body text-[10px] text-[#ff4d6a]">{atRisk} at risk</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Three-column task grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIMEFRAMES.map((tf) => (
              <TaskColumn
                key={tf}
                timeframe={tf}
                tasks={tasksByTimeframe(tf)}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onAddClick={() => openModal(tf)}
              />
            ))}
          </motion.div>

          {/* Empty state */}
          {tasks.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-20"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#00b4ff]/10 border border-[#00b4ff]/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-5 h-5 text-[#00b4ff]" />
              </div>
              <h3 className="font-display font-semibold text-base text-white/60 mb-1">
                No targets yet
              </h3>
              <p className="font-body text-sm text-white/30 mb-4">
                Start by adding your first daily, weekly, or monthly target.
              </p>
              <button
                onClick={() => openModal("weekly")}
                className="btn-electric px-6 py-2.5 text-sm"
              >
                Add First Target
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <TaskFormModal
        userId={profile.id}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => {}}
      />
    </>
  );
}
