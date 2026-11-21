import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  className?: string;
}

export default function Card({ hover = true, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#D8EAF8] rounded-2xl p-6 shadow-sm",
        hover && "transition-all duration-200 hover:border-[#0875C9] hover:shadow-nsk-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
