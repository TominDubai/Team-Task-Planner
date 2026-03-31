import Link from "next/link";
import { Target } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#121212] bg-grid flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 rounded-xl bg-[#00b4ff]/10 border border-[#00b4ff]/20 flex items-center justify-center mx-auto mb-4">
          <Target className="w-6 h-6 text-[#00b4ff]" />
        </div>
        <p className="text-xs font-semibold tracking-[0.2em] text-white/30 uppercase mb-2">
          404
        </p>
        <h1 className="font-display text-xl font-bold text-white mb-2">Page not found</h1>
        <p className="font-body text-sm text-white/40 mb-6">
          That route doesn&apos;t exist in this workspace.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-[#00b4ff] to-[#0070cc]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
