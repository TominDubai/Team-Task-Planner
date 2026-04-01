import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(Math.round((value / target) * 100), 100);
}

export function getStatusColor(status: string) {
  switch (status) {
    case "complete":
      return "text-[#00e5a0]";
    case "in_progress":
      return "text-[#f5a623]";
    case "at_risk":
      return "text-[#ff4d6a]";
    default:
      return "text-white/40";
  }
}

export function getStatusLabel(status: string) {
  switch (status) {
    case "complete":
      return "Complete";
    case "in_progress":
      return "In Progress";
    case "at_risk":
      return "At Risk";
    default:
      return "Pending";
  }
}

export function getProgressColor(pct: number): string {
  if (pct >= 100) return "#00e5a0";
  if (pct >= 60) return "#00b4ff";
  if (pct >= 30) return "#f5a623";
  return "#ff4d6a";
}

export function getVibeLabel(vibe: string) {
  switch (vibe) {
    case "🚀":
      return "In the zone";
    case "☕":
      return "Getting warmed up";
    case "🐢":
      return "Taking it slow";
    default:
      return "";
  }
}

export function timeframeLabel(tf: string) {
  switch (tf) {
    case "daily":
      return "Today";
    case "weekly":
      return "This Week";
    case "monthly":
      return "This Month";
    default:
      return tf;
  }
}

export function avatarUrl(name: string, seed?: string): string {
  const safe = (name && String(name).trim()) || "user";
  const s = seed || safe.replace(/\s/g, "-").toLowerCase();
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(s)}&backgroundColor=0b0b0b&textColor=00b4ff&fontSize=38&fontWeight=700`;
}

