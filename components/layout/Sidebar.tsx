"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  LogOut,
  Target,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import ProfileAvatar from "@/components/ui/ProfileAvatar";

const navItems = [
  {
    href: "/dashboard",
    label: "My Space",
    icon: LayoutDashboard,
    description: "Your targets",
  },
  {
    href: "/team",
    label: "Collective Pulse",
    icon: Users,
    description: "Team overview",
  },
  {
    href: "/admin",
    label: "Manager Portal",
    icon: ShieldCheck,
    description: "Staff progress",
    adminOnly: true,
  },
];

interface SidebarProps {
  profile: Profile;
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const visibleNav = navItems.filter(
    (item) => !item.adminOnly || profile.role === "admin"
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] flex flex-col z-40 border-r border-white/[0.06]"
      style={{ background: "rgba(14, 14, 14, 0.92)", backdropFilter: "blur(20px)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-lg bg-[#00b4ff]/10 border border-[#00b4ff]/20 flex items-center justify-center flex-shrink-0">
          <Target className="w-4 h-4 text-[#00b4ff]" />
        </div>
        <div>
          <p className="font-display text-sm font-bold tracking-tight text-white leading-none">
            Formed
          </p>
          <p className="font-display text-[10px] font-medium tracking-widest text-white/30 uppercase leading-none mt-0.5">
            Design
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="section-label px-3 mb-3">Navigation</p>
        {visibleNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150",
                  isActive
                    ? "bg-[#00b4ff]/10 border border-[#00b4ff]/20"
                    : "hover:bg-white/[0.04] border border-transparent"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(0, 180, 255, 0.06)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0 transition-colors",
                    isActive ? "text-[#00b4ff]" : "text-white/40 group-hover:text-white/70"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-body text-sm font-medium leading-none transition-colors",
                    isActive ? "text-white" : "text-white/60 group-hover:text-white/85"
                  )}>
                    {item.label}
                  </p>
                  <p className="font-body text-[10px] text-white/25 mt-0.5 leading-none">
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <ChevronRight className="w-3 h-3 text-[#00b4ff]/60 flex-shrink-0" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="glass-card p-3 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <ProfileAvatar profile={profile} size={32} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 text-[10px] leading-none">
              {profile.current_vibe}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-xs font-medium text-white/85 truncate leading-tight">
              {profile.full_name}
            </p>
            <p className="font-body text-[10px] text-white/30 leading-tight capitalize">
              {profile.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
