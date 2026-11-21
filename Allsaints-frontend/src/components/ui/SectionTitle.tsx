import { cn } from "@/lib/utils";

interface SectionTitleProps {
  tag?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionTitle({
  tag,
  title,
  subtitle,
  align = "center",
  light = false,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {tag && (
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-widest block mb-2 font-sans",
            light ? "text-[#FFB900]" : "text-[#0875C9]"
          )}
        >
          {tag}
        </span>
      )}

      <h2
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl font-serif font-bold leading-tight tracking-tight",
          light ? "text-white" : "text-[#092F78]"
        )}
      >
        {title}
      </h2>

      {/* Signature Blue & Soft Yellow Accent Underline */}
      <div
        className={cn(
          "w-16 h-1 bg-gradient-to-r from-[#0875C9] to-[#FFB900] rounded-full my-3",
          align === "center" ? "mx-auto" : "ml-0"
        )}
      />

      {subtitle && (
        <p
          className={cn(
            "text-xs sm:text-sm max-w-2xl font-sans leading-relaxed",
            align === "center" ? "mx-auto" : "ml-0",
            light ? "text-slate-200" : "text-slate-600"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
