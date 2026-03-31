"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import type { Task, Timeframe } from "@/lib/types";
import TaskCard from "./TaskCard";
import { timeframeLabel } from "@/lib/utils";

interface TaskColumnProps {
  timeframe: Timeframe;
  tasks: Task[];
  onDelete: (id: string) => void;
  onUpdate: (updated: Task) => void;
  onAddClick: () => void;
}

const ACCENT: Record<Timeframe, string> = {
  daily: "#00b4ff",
  weekly: "#00e5a0",
  monthly: "#f5a623",
};

export default function TaskColumn({
  timeframe,
  tasks,
  onDelete,
  onUpdate,
  onAddClick,
}: TaskColumnProps) {
  const color = ACCENT[timeframe];
  const completedCount = tasks.filter((t) => t.status === "complete").length;

  return (
    <div className="flex flex-col gap-4 min-w-0">
      {/* Column header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}80` }} />
          <h2 className="font-display font-semibold text-sm text-white/85 tracking-tight">
            {timeframeLabel(timeframe)}
          </h2>
          <span className="font-mono text-[10px] text-white/25 ml-1">
            {completedCount}/{tasks.length}
          </span>
        </div>
        <button
          onClick={onAddClick}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/[0.06] text-white/30 hover:text-white/60 border border-transparent hover:border-white/[0.08]"
          title={`Add ${timeframe} target`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Accent line */}
      <div className="h-px w-full opacity-25" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      {/* Task list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed border-white/[0.06] py-8 text-center"
            >
              <p className="font-body text-xs text-white/20">No targets yet</p>
              <button
                onClick={onAddClick}
                className="mt-2 font-body text-xs text-white/35 hover:text-white/60 transition-colors underline underline-offset-2"
              >
                Add one
              </button>
            </motion.div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
