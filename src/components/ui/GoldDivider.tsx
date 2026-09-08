import { cn } from "@/lib/utils";

interface GoldDividerProps {
  className?: string;
  decorative?: boolean;
}

/** A thin golden rule with a central diamond flourish. */
export default function GoldDivider({
  className,
  decorative = true,
}: GoldDividerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)} aria-hidden="true">
      <span className="hairline-gold w-16 sm:w-24" />
      {decorative ? (
        <svg width="14" height="14" viewBox="0 0 14 14" className="text-gold animate-pulse-gold">
          <rect
            x="7"
            y="0"
            width="9.9"
            height="9.9"
            transform="rotate(45 7 0)"
            fill="currentColor"
          />
        </svg>
      ) : null}
      <span className="hairline-gold w-16 sm:w-24" />
    </div>
  );
}
