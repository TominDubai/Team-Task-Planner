"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { Profile, Task } from "@/lib/types";
import { formatPercent, getVibeLabel } from "@/lib/utils";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import ProgressRing from "@/components/ui/ProgressRing";

interface MemberCardProps {
  profile: Profile;
  tasks: Task[];
  index: number;
}

export default function MemberCard({ profile, tasks, index }: MemberCardProps) {
  const weeklyTasks = tasks.filter((t) => t.timeframe === "weekly");
  const monthlyTasks = tasks.filter((t) => t.timeframe === "monthly");
  const allTasks = tasks;

  const weeklyPct =
    weeklyTasks.length > 0
      ? Math.round(
          weeklyTasks.reduce((s, t) => s + formatPercent(t.actual_value, t.target_value), 0) /
            weeklyTasks.length
        )
      : 0;

  const overallPct =
    allTasks.length > 0
      ? Math.round(
          allTasks.reduce((s, t) => s + formatPercent(t.actual_value, t.target_value), 0) /
            allTasks.length
        )
      : 0;

  const completedCount = allTasks.filter((t) => t.status === "complete").length;
  const atRiskCount = allTasks.filter((t) => t.status === "at_risk").length;
  const monthlyPct =
    monthlyTasks.length > 0
      ? Math.round(
          monthlyTasks.reduce((s, t) => s + formatPercent(t.actual_value, t.target_value), 0) /
            monthlyTasks.length
        )
      : 0;

  return (
    <motion.div
      initial={{ opacity: 1, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-5 flex flex-col gap-4 relative overflow-hidden group"
    >
      {/* Background glow based on progress */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${
            weeklyPct >= 80
              ? "rgba(0,229,160,0.04)"
              : weeklyPct >= 50
              ? "rgba(0,180,255,0.04)"
              : "rgba(245,166,35,0.04)"
          }, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
              <ProfileAvatar profile={profile} size={40} />
            </div>
            <span className="absolute -bottom-1 -right-1 text-xs leading-none">
              {profile.current_vibe}
            </span>
          </div>
          <div>
            <p className="font-body font-medium text-sm text-white/90 leading-tight">
              {profile.full_name}
            </p>
            <p className="font-body text-[10px] text-white/30 mt-0.5 leading-none">
              {getVibeLabel(profile.current_vibe)}
            </p>
          </div>
        </div>

        {atRiskCount > 0 && (
          <div className="flex items-center gap-1 rounded-lg px-2 py-1 text-[#ff4d6a] bg-[#ff4d6a]/10 border border-[#ff4d6a]/20">
            <AlertTriangle className="w-3 h-3" />
            <span className="font-body text-[10px] font-medium">{atRiskCount}</span>
          </div>
        )}
      </div>

      {/* Weekly progress ring — hero element */}
      <div className="flex items-center justify-center py-2">
        <div className="relative">
          <ProgressRing
            pct={weeklyPct}
            size={110}
            strokeWidth={7}
            label={`${weeklyPct}%`}
            sublabel="weekly"
            animated
          />
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06]">
        {[
          { label: "Monthly", value: `${monthlyPct}%`, color: "#f5a623" },
          { label: "Overall", value: `${overallPct}%`, color: "#00b4ff" },
          { label: "Done", value: `${completedCount}`, color: "#00e5a0" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display font-bold text-base leading-none" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="font-body text-[9px] text-white/25 mt-1 leading-none uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Task count */}
      <div className="flex justify-center">
        <span className="font-body text-[10px] text-white/20">
          {allTasks.length} target{allTasks.length !== 1 ? "s" : ""}
        </span>
      </div>
    </motion.div>
  );
}
