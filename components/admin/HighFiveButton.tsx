"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Hand } from "lucide-react";
import toast from "react-hot-toast";

interface HighFiveButtonProps {
  recipientName: string;
  recipientId: string;
}

export default function HighFiveButton({ recipientName, recipientId: _recipientId }: HighFiveButtonProps) {
  const [sent, setSent] = useState(false);

  const sendHighFive = () => {
    if (sent) return;
    setSent(true);

    toast(
      <div className="flex items-center gap-3">
        <span className="text-2xl">🙌</span>
        <div>
          <p className="font-body font-medium text-white/90 text-sm">High-Five sent!</p>
          <p className="font-body text-xs text-white/40">
            You gave {recipientName} a boost
          </p>
        </div>
      </div>,
      { duration: 3500 }
    );

    // Reset after animation
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <motion.button
      onClick={sendHighFive}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all duration-150"
      style={{
        background: sent ? "rgba(245,166,35,0.15)" : "rgba(255,255,255,0.04)",
        color: sent ? "#f5a623" : "rgba(255,255,255,0.4)",
        border: `1px solid ${sent ? "rgba(245,166,35,0.3)" : "rgba(255,255,255,0.08)"}`,
      }}
      title={`Send High-Five to ${recipientName}`}
    >
      <motion.span
        animate={sent ? { rotate: [0, -20, 20, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="inline-block"
      >
        {sent ? "🙌" : <Hand className="w-3 h-3" />}
      </motion.span>
      {sent ? "Sent!" : "High-Five"}
    </motion.button>
  );
}
