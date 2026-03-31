import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className, noPadding, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-card",
        !noPadding && "p-6",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
