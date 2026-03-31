"use client";

import { motion } from "framer-motion";
import { getProgressColor } from "@/lib/utils";

interface ProgressRingProps {
  pct: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  animated?: boolean;
}

export default function ProgressRing({
  pct,
  size = 96,
  strokeWidth = 6,
  label,
  sublabel,
  animated = true,
}: ProgressRingProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.min(pct, 100) / 100) * circumference;
  const color = getProgressColor(pct);
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        {animated ? (
          <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        ) : (
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
          />
        )}
      </svg>

      {/* Center label */}
      {(label || sublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label && (
            <span
              className="font-display font-bold leading-none"
              style={{ color, fontSize: size < 80 ? "12px" : "16px" }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              className="font-body text-white/35 leading-none mt-0.5"
              style={{ fontSize: "9px" }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
