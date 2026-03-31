"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Target, ArrowRight, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/dashboard";
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
        setMode("login");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] bg-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,180,255,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,229,160,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Corner decoration */}
      <div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-transparent via-[#00b4ff]/30 to-transparent" />
      <div className="absolute top-0 left-0 h-px w-32 bg-gradient-to-r from-transparent via-[#00b4ff]/30 to-transparent" />
      <div className="absolute bottom-0 right-0 w-px h-32 bg-gradient-to-t from-transparent via-[#00b4ff]/20 to-transparent" />
      <div className="absolute bottom-0 right-0 h-px w-32 bg-gradient-to-l from-transparent via-[#00b4ff]/20 to-transparent" />

      <motion.div
        initial={{ opacity: 1, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Brand mark */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border border-[#00b4ff]/30 flex items-center justify-center"
              style={{ background: "rgba(0,180,255,0.08)" }}
            >
              <Target className="w-5 h-5 text-[#00b4ff]" />
            </div>
            <div>
              <p className="font-display text-lg font-bold tracking-tight text-white leading-none">
                Formed
              </p>
              <p className="font-display text-[10px] font-medium tracking-[0.25em] text-white/30 uppercase mt-0.5">
                Design Studio
              </p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="mb-6">
            <h1 className="font-display text-xl font-bold text-white tracking-tight mb-1">
              {mode === "login" ? "Welcome back" : "Join your team"}
            </h1>
            <p className="font-body text-sm text-white/40">
              {mode === "login"
                ? "Sign in to your workspace"
                : "Create your account to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block mb-1.5">
                  <span className="font-body text-xs font-medium text-white/40 uppercase tracking-wider">
                    Full Name
                  </span>
                </label>
                <div className="relative focus-electric rounded-xl border border-white/[0.1]"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    required
                    className="w-full bg-transparent px-4 py-3 pr-10 font-body text-sm text-white placeholder-white/25 outline-none rounded-xl"
                  />
                </div>
              </motion.div>
            )}

            <div>
              <label className="block mb-1.5">
                <span className="font-body text-xs font-medium text-white/40 uppercase tracking-wider">
                  Email
                </span>
              </label>
              <div className="relative focus-electric rounded-xl border border-white/[0.1]"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@formeddesign.co"
                  required
                  className="w-full bg-transparent pl-10 pr-4 py-3 font-body text-sm text-white placeholder-white/25 outline-none rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1.5">
                <span className="font-body text-xs font-medium text-white/40 uppercase tracking-wider">
                  Password
                </span>
              </label>
              <div className="relative focus-electric rounded-xl border border-white/[0.1]"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full bg-transparent pl-10 pr-10 py-3 font-body text-sm text-white placeholder-white/25 outline-none rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="btn-electric w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.07] text-center">
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-body text-sm text-white/35 hover:text-white/65 transition-colors"
            >
              {mode === "login" ? (
                <>Don&apos;t have an account? <span className="text-[#00b4ff]">Sign up</span></>
              ) : (
                <>Already have an account? <span className="text-[#00b4ff]">Sign in</span></>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 font-body text-[11px] text-white/20 tracking-widest uppercase">
          Formed Design &mdash; Team Planner
        </p>
      </motion.div>
    </div>
  );
}
