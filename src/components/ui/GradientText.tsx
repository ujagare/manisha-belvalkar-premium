import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  as?: ElementType;
  variant?: "gold" | "crimson";
  className?: string;
}

/** Gold-shimmer or crimson-gradient display text. */
export default function GradientText({
  children,
  as: Tag = "span",
  variant = "gold",
  className,
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        variant === "gold" ? "text-gold-shimmer" : "text-crimson-gradient",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
