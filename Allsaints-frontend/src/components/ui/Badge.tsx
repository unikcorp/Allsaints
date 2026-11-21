import { cn } from "@/lib/utils";
import { capitalise } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "blue" | "green" | "gold" | "navy" | "default";
  className?: string;
}

export default function Badge({ label, variant = "blue", className }: BadgeProps) {
  const styles = {
    blue: "bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]",
    green: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
    gold: "bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]",
    navy: "bg-[#F8FAFC] text-[#0F2744] border-slate-200",
    default: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-block px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border",
        styles[variant],
        className
      )}
    >
      {capitalise(label)}
    </span>
  );
}
