"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useSupabaseBrowser } from "@/hooks/use-supabase-browser";
import { cn, formatPercent, getProgressColor } from "@/lib/utils";
import type { Task, TaskStatus } from "@/lib/types";
import ProgressRing from "@/components/ui/ProgressRing";
import ConfettiCelebration from "@/components/ui/ConfettiCelebration";
import toast from "react-hot-toast";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (updated: Task) => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "complete", label: "Complete" },
  { value: "at_risk", label: "At Risk" },
];

export default function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [actualValue, setActualValue] = useState(task.actual_value);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [saving, setSaving] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const supabase = useSupabaseBrowser();

  const pct = formatPercent(actualValue, task.target_value);
  const color = getProgressColor(pct);

  const handleSlider = (val: number) => {
    setActualValue(val);
    const newPct = formatPercent(val, task.target_value);
    if (newPct >= 100 && formatPercent(task.actual_value, task.target_value) < 100) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 5000);
    }
  };

  const handleSave = async () => {
    if (!supabase) {
      toast.error("Not ready yet — try again");
      return;
    }
    setSaving(true);
    const newStatus: TaskStatus =
      pct >= 100 ? "complete" : actualValue > 0 ? "in_progress" : status;

    const { error } = await supabase
      .from("tasks")
      .update({
        actual_value: actualValue,
        status: status === "at_risk" ? "at_risk" : newStatus,
      })
      .eq("id", task.id);

    setSaving(false);
    if (error) {
      toast.error("Failed to save");
    } else {
      onUpdate({ ...task, actual_value: actualValue, status: newStatus });
      toast.success("Progress saved");
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!supabase) {
      toast.error("Not ready yet — try again");
      return;
    }
    setStatus(newStatus);
    setSaving(true);
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", task.id);
    setSaving(false);
    if (!error) onUpdate({ ...task, status: newStatus });
  };

  const handleDelete = async () => {
    if (!supabase) {
      toast.error("Not ready yet — try again");
      return;
    }
    const { error } = await supabase.from("tasks").delete().eq("id", task.id);
    if (error) {
      toast.error("Could not delete task");
    } else {
      onDelete(task.id);
    }
  };

  return (
    <>
      <ConfettiCelebration trigger={celebrate} />
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        className="glass-card overflow-hidden"
      >
        {/* Top bar accent */}
        <div
          className="h-[2px] w-full"
          style={{
            background: `linear-gradient(90deg, ${color}80 0%, ${color}20 100%)`,
          }}
        />

        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Progress ring */}
            <ProgressRing
              pct={pct}
              size={72}
              strokeWidth={5}
              label={`${pct}%`}
              sublabel="done"
              animated
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-body font-medium text-sm text-white/90 leading-snug flex-1">
                  {task.title}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
                  >
                    {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress values */}
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-xs text-white/40">
                  {actualValue} / {task.target_value}
                </span>
                {pct >= 100 && (
                  <span className="flex items-center gap-1 text-[10px] font-body font-medium text-[#00e5a0]">
                    <CheckCircle2 className="w-3 h-3" />
                    Complete
                  </span>
                )}
                {status === "at_risk" && (
                  <span className="flex items-center gap-1 text-[10px] font-body font-medium text-[#ff4d6a]">
                    <AlertTriangle className="w-3 h-3" />
                    At Risk
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Expanded controls */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-4">
                  {/* Slider */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-body text-xs text-white/35">Actual progress</span>
                      <span className="font-mono text-xs font-semibold" style={{ color }}>
                        {actualValue}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={0}
                        max={task.target_value}
                        step={1}
                        value={actualValue}
                        onChange={(e) => handleSlider(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(90deg, ${color} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
                          accentColor: color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <span className="font-body text-xs text-white/35 block mb-2">
                      Status override
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleStatusChange(opt.value)}
                          className={cn(
                            "text-[11px] font-body font-medium px-2.5 py-1 rounded-lg transition-all",
                            opt.value === "complete" && status === opt.value && "status-complete",
                            opt.value === "in_progress" && status === opt.value && "status-inprogress",
                            opt.value === "at_risk" && status === opt.value && "status-atrisk",
                            opt.value === "pending" && status === opt.value && "status-pending",
                            status !== opt.value && "text-white/30 hover:text-white/55 border border-transparent hover:border-white/10"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save button */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-electric w-full text-xs py-2 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Progress"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
