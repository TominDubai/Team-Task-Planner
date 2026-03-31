"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { getVibeLabel } from "@/lib/utils";
import type { Vibe } from "@/lib/types";

const VIBES: Vibe[] = ["🚀", "☕", "🐢"];

interface VibeCheckProps {
  currentVibe: Vibe;
  userId: string;
  onUpdate?: (vibe: Vibe) => void;
}

export default function VibeCheck({ currentVibe, userId, onUpdate }: VibeCheckProps) {
  const [vibe, setVibe] = useState<Vibe>(currentVibe);
  const [loading, setLoading] = useState(false);

  const updateVibe = async (newVibe: Vibe) => {
    if (newVibe === vibe || loading) return;
    setLoading(true);
    const prev = vibe;
    setVibe(newVibe);

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ current_vibe: newVibe })
      .eq("id", userId);

    if (error) {
      setVibe(prev);
      toast.error("Could not update vibe");
    } else {
      onUpdate?.(newVibe);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="section-label">Vibe Check</span>
      <div className="flex items-center gap-1 rounded-xl p-1 border border-white/[0.08]"
        style={{ background: "rgba(255,255,255,0.03)" }}>
        {VIBES.map((v) => (
          <motion.button
            key={v}
            onClick={() => updateVibe(v)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            title={getVibeLabel(v)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-xl transition-all duration-150"
            style={{
              background: vibe === v ? "rgba(255,255,255,0.08)" : "transparent",
            }}
          >
            <AnimatePresence>
              {vibe === v && (
                <motion.div
                  layoutId="vibe-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(0,180,255,0.12)", border: "1px solid rgba(0,180,255,0.25)" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </AnimatePresence>
            <span className="relative z-10" style={{ filter: vibe === v ? "none" : "grayscale(0.5) opacity(0.5)" }}>
              {v}
            </span>
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={vibe}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="font-body text-xs text-white/35"
        >
          {getVibeLabel(vibe)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
