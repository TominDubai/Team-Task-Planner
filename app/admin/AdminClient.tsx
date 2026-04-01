"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSupabaseBrowser } from "@/hooks/use-supabase-browser";
import type { Profile, Task } from "@/lib/types";
import { formatPercent, getProgressColor } from "@/lib/utils";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { ShieldCheck, AlertTriangle, TrendingUp, Users, CheckSquare, Search, ChevronUp, ChevronDown } from "lucide-react";
import HighFiveButton from "@/components/admin/HighFiveButton";

interface AdminClientProps {
  currentUser: Profile;
  initialProfiles: Profile[];
  initialTasks: Task[];
}

type SortKey = "name" | "daily" | "weekly" | "monthly" | "atRisk" | "done";
type SortDir = "asc" | "desc";

export default function AdminClient({ currentUser: _currentUser, initialProfiles, initialTasks }: AdminClientProps) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const supabase = useSupabaseBrowser();

  // Real-time subscriptions
  useEffect(() => {
    if (!supabase) return;
    const ch1 = supabase
      .channel("admin-profiles")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, (p) => {
        setProfiles((prev) => prev.map((x) => (x.id === (p.new as Profile).id ? (p.new as Profile) : x)));
      })
      .subscribe();

    const ch2 = supabase
      .channel("admin-tasks")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "tasks" }, (p) => {
        setTasks((prev) => [p.new as Task, ...prev]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "tasks" }, (p) => {
        setTasks((prev) => prev.map((t) => (t.id === (p.new as Task).id ? (p.new as Task) : t)));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "tasks" }, (p) => {
        setTasks((prev) => prev.filter((t) => t.id !== p.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ch1);
      supabase.removeChannel(ch2);
    };
  }, [supabase]);

  const staffRows = useMemo(() => {
    return profiles.map((profile) => {
      const userTasks = tasks.filter((t) => t.user_id === profile.id);
      const byTf = (tf: string) => userTasks.filter((t) => t.timeframe === tf);

      const pct = (tfTasks: Task[]) =>
        tfTasks.length > 0
          ? Math.round(tfTasks.reduce((s, t) => s + formatPercent(t.actual_value, t.target_value), 0) / tfTasks.length)
          : 0;

      return {
        profile,
        dailyPct: pct(byTf("daily")),
        weeklyPct: pct(byTf("weekly")),
        monthlyPct: pct(byTf("monthly")),
        atRiskTasks: userTasks.filter((t) => t.status === "at_risk"),
        completedCount: userTasks.filter((t) => t.status === "complete").length,
        totalCount: userTasks.length,
      };
    });
  }, [profiles, tasks]);

  const filteredRows = useMemo(() => {
    const filtered = staffRows.filter((r) =>
      r.profile.full_name.toLowerCase().includes(search.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortKey) {
        case "name": aVal = a.profile.full_name; bVal = b.profile.full_name; break;
        case "daily": aVal = a.dailyPct; bVal = b.dailyPct; break;
        case "weekly": aVal = a.weeklyPct; bVal = b.weeklyPct; break;
        case "monthly": aVal = a.monthlyPct; bVal = b.monthlyPct; break;
        case "atRisk": aVal = a.atRiskTasks.length; bVal = b.atRiskTasks.length; break;
        case "done": aVal = a.completedCount; bVal = b.completedCount; break;
        default: return 0;
      }

      if (typeof aVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [staffRows, search, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? (
        <ChevronUp className="w-3 h-3 text-[#00b4ff]" />
      ) : (
        <ChevronDown className="w-3 h-3 text-[#00b4ff]" />
      )
    ) : (
      <ChevronDown className="w-3 h-3 text-white/20" />
    );

  const totalAtRisk = tasks.filter((t) => t.status === "at_risk");
  const totalComplete = tasks.filter((t) => t.status === "complete").length;
  const teamWeeklyPct =
    staffRows.length > 0
      ? Math.round(staffRows.reduce((s, r) => s + r.weeklyPct, 0) / staffRows.length)
      : 0;

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
            <div className="flex items-center gap-2 mb-1">
              <p className="section-label">Manager Portal</p>
              <div className="flex items-center gap-1 rounded-md px-1.5 py-0.5 bg-[#00b4ff]/10 border border-[#00b4ff]/20">
                <ShieldCheck className="w-3 h-3 text-[#00b4ff]" />
                <span className="font-body text-[10px] font-medium text-[#00b4ff]">Admin</span>
              </div>
            </div>
            <h1 className="page-title">Staff Progress</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl text-sm font-body text-white/70 placeholder-white/25 outline-none border border-white/[0.08] focus:border-[#00b4ff]/40 transition-colors w-44"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          </div>
        </motion.div>

        {/* KPI cards */}
        <motion.div
          initial={{ opacity: 1, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="grid grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Users, label: "Team Size", value: profiles.length, color: "#00b4ff", sub: "members" },
            { icon: TrendingUp, label: "Weekly Avg", value: `${teamWeeklyPct}%`, color: "#00e5a0", sub: "completion" },
            { icon: CheckSquare, label: "Completed", value: totalComplete, color: "#00e5a0", sub: "tasks" },
            { icon: AlertTriangle, label: "At Risk", value: totalAtRisk.length, color: "#ff4d6a", sub: "tasks", urgent: totalAtRisk.length > 0 },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div
                key={i}
                className="glass-card p-5 flex items-center gap-4"
                style={kpi.urgent ? { borderColor: "rgba(255,77,106,0.2)" } : {}}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${kpi.color}12`, border: `1px solid ${kpi.color}25` }}
                >
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                <div>
                  <p className="font-body text-xs text-white/35">{kpi.label}</p>
                  <p className="font-display font-bold text-xl leading-tight" style={{ color: kpi.color }}>
                    {kpi.value}
                    {" "}
                    <span className="font-body text-xs text-white/25 font-normal">{kpi.sub}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* At-Risk section */}
        {totalAtRisk.length > 0 && (
          <motion.div
            initial={{ opacity: 1, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-card p-5 mb-8 border-[#ff4d6a]/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-[#ff4d6a]" />
              <h2 className="font-display font-semibold text-sm text-white/85">At-Risk Tasks</h2>
              <span className="font-mono text-[10px] text-[#ff4d6a] ml-1">{totalAtRisk.length} items</span>
            </div>
            <div className="space-y-2">
              {totalAtRisk.map((task) => {
                const owner = profiles.find((p) => p.id === task.user_id);
                const pct = formatPercent(task.actual_value, task.target_value);
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 border border-[#ff4d6a]/10"
                    style={{ background: "rgba(255,77,106,0.05)" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d6a] flex-shrink-0" style={{ boxShadow: "0 0 6px rgba(255,77,106,0.6)" }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-white/80 truncate">{task.title}</p>
                      {owner && (
                        <p className="font-body text-[10px] text-white/30">{owner.full_name}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#ff4d6a]">{pct}%</span>
                      <span className="font-body text-[10px] text-white/20 capitalize">{task.timeframe}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Main staff table */}
        <motion.div
          initial={{ opacity: 1, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="glass-card overflow-hidden"
          style={{ padding: 0 }}
        >
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-0 px-5 py-3 border-b border-white/[0.06]">
            {(
              [
                { key: "name" as SortKey, label: "Member" },
                { key: "daily" as SortKey, label: "Daily" },
                { key: "weekly" as SortKey, label: "Weekly" },
                { key: "monthly" as SortKey, label: "Monthly" },
                { key: "atRisk" as SortKey, label: "At Risk" },
                { key: "done" as SortKey, label: "Done" },
              ] as const
            ).map((col) => (
              <button
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="flex items-center gap-1.5 text-left group"
              >
                <span className="section-label text-[10px] group-hover:text-white/50 transition-colors">
                  {col.label}
                </span>
                <SortIcon col={col.key} />
              </button>
            ))}
            <div className="flex justify-end">
              <span className="section-label text-[10px]">Action</span>
            </div>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-white/[0.04]">
            {filteredRows.length === 0 ? (
              <div className="text-center py-12">
                <p className="font-body text-sm text-white/25">No staff found.</p>
              </div>
            ) : (
              filteredRows.map((row, i) => {
                const weeklyColor = getProgressColor(row.weeklyPct);
                return (
                  <motion.div
                    key={row.profile.id}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-0 px-5 py-3.5 items-center hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Member info */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10">
                          <ProfileAvatar profile={row.profile} size={32} />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 text-[10px] leading-none">
                          {row.profile.current_vibe}
                        </span>
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium text-white/85">{row.profile.full_name}</p>
                        <p className="font-body text-[10px] text-white/25 capitalize">{row.profile.role}</p>
                      </div>
                    </div>

                    {/* Daily */}
                    <ProgressCell pct={row.dailyPct} />

                    {/* Weekly */}
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${row.weeklyPct}%`,
                            background: weeklyColor,
                            boxShadow: `0 0 4px ${weeklyColor}60`,
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs font-semibold" style={{ color: weeklyColor }}>
                        {row.weeklyPct}%
                      </span>
                    </div>

                    {/* Monthly */}
                    <ProgressCell pct={row.monthlyPct} />

                    {/* At Risk */}
                    <div>
                      {row.atRiskTasks.length > 0 ? (
                        <span className="status-atrisk">{row.atRiskTasks.length}</span>
                      ) : (
                        <span className="font-body text-xs text-white/20">—</span>
                      )}
                    </div>

                    {/* Done */}
                    <div>
                      <span className="font-body text-xs text-white/50">
                        <span className="text-[#00e5a0] font-medium">{row.completedCount}</span>
                        <span className="text-white/20"> / {row.totalCount}</span>
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end">
                      <HighFiveButton
                        recipientName={row.profile.full_name}
                        recipientId={row.profile.id}
                      />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProgressCell({ pct }: { pct: number }) {
  const color = getProgressColor(pct);
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-xs" style={{ color: pct > 0 ? color : "rgba(255,255,255,0.2)" }}>
        {pct > 0 ? `${pct}%` : "—"}
      </span>
    </div>
  );
}
