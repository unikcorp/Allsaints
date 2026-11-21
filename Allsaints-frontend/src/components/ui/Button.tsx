import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  href?: string;
}

const variants = {
  // Primary Blue
  primary: "bg-[#0875C9] text-white hover:bg-[#0066B5] border border-[#0875C9] shadow-sm font-semibold",
  // Accent Yellow
  accent:  "bg-[#FFB900] text-slate-950 hover:bg-[#E0A300] border border-[#FFB900] shadow-sm font-semibold",
  // Outline Blue
  outline: "bg-transparent text-[#0875C9] border-2 border-[#0875C9] hover:bg-[#EAF6FF] font-semibold",
  // Soft Pastel Blue Secondary
  secondary: "bg-[#EAF6FF] text-[#0875C9] hover:bg-[#D9EEFF] border border-[#D8EAF8] font-semibold",
};

const sizes = {
  sm: "px-3.5 py-1.5 text-xs tracking-wide uppercase",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded transition-all duration-200 cursor-pointer select-none font-sans",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
