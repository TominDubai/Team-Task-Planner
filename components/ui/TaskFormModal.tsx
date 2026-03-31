"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Timeframe } from "@/lib/types";

interface TaskFormModalProps {
  userId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function TaskFormModal({ userId, open, onClose, onCreated }: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [timeframe, setTimeframe] = useState<Timeframe>("weekly");
  const [target, setTarget] = useState("100");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const reset = () => {
    setTitle("");
    setTimeframe("weekly");
    setTarget("100");
    setDueDate("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const { error } = await supabase.from("tasks").insert({
      user_id: userId,
      title: title.trim(),
      timeframe,
      target_value: parseFloat(target) || 100,
      actual_value: 0,
      status: "pending",
      due_date: dueDate || null,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to create task");
    } else {
      toast.success("Task created!");
      reset();
      onCreated();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="glass-card p-6 mx-4">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-display font-bold text-base text-white tracking-tight">
                    New Target
                  </h2>
                  <p className="font-body text-xs text-white/35 mt-0.5">
                    Add a new task to your planner
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block mb-1.5">
                    <span className="font-body text-[11px] font-medium text-white/40 uppercase tracking-wider">
                      Task Title
                    </span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Complete brand refresh deck"
                    required
                    className="w-full rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/25 outline-none border border-white/[0.1] focus:border-[#00b4ff]/50 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5">
                      <span className="font-body text-[11px] font-medium text-white/40 uppercase tracking-wider">
                        Timeframe
                      </span>
                    </label>
                    <div className="flex gap-1 rounded-xl p-1 border border-white/[0.1]"
                      style={{ background: "rgba(255,255,255,0.03)" }}>
                      {TIMEFRAMES.map((tf) => (
                        <button
                          key={tf.value}
                          type="button"
                          onClick={() => setTimeframe(tf.value)}
                          className="flex-1 py-1.5 rounded-lg text-xs font-body font-medium transition-all"
                          style={{
                            background: timeframe === tf.value ? "rgba(0,180,255,0.15)" : "transparent",
                            color: timeframe === tf.value ? "#00b4ff" : "rgba(255,255,255,0.35)",
                            border: timeframe === tf.value ? "1px solid rgba(0,180,255,0.25)" : "1px solid transparent",
                          }}
                        >
                          {tf.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5">
                      <span className="font-body text-[11px] font-medium text-white/40 uppercase tracking-wider">
                        Target Value
                      </span>
                    </label>
                    <input
                      type="number"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      min="1"
                      max="9999"
                      className="w-full rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/25 outline-none border border-white/[0.1] focus:border-[#00b4ff]/50 transition-colors"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5">
                    <span className="font-body text-[11px] font-medium text-white/40 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Due Date (optional)
                    </span>
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 font-body text-sm text-white/70 outline-none border border-white/[0.1] focus:border-[#00b4ff]/50 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", colorScheme: "dark" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="btn-electric w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>{loading ? "Creating..." : "Create Target"}</span>
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
