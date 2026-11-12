import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface SubmenuItem {
  href: string;
  label: string;
}

interface InternalSubmenuProps {
  activeHref: string;
  backHref: string;
  backLabel: string;
  items: SubmenuItem[];
  label: string;
}

export default function InternalSubmenu({
  activeHref,
  backHref,
  backLabel,
  items,
  label,
}: InternalSubmenuProps) {
  return (
    <nav
      aria-label={`${label} submenu`}
      className="sticky top-16 z-40 border-y border-[#d7bd6a]/30 bg-[#fffaf0]/95 shadow-[0_12px_35px_-28px_rgba(74,24,17,0.65)] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-stretch px-3 sm:px-6 lg:px-10">
        <Link
          href={backHref}
          aria-label={backLabel}
          className="group flex shrink-0 items-center gap-2 border-r border-[#6b0b0b]/12 pr-3 text-sm font-semibold text-[#6b0b0b] transition-colors hover:text-[#a81414] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#a81414] sm:pr-6"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span className="hidden md:inline">{backLabel}</span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 px-3 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#9b7e32] sm:px-4 sm:py-4 sm:text-xs md:px-6">
            {label}
          </span>
          {items.map((item) => {
            const active = item.href === activeHref;

            return (
              <Link
                aria-current={active ? "page" : undefined}
                href={item.href}
                key={item.href}
                className={`group relative flex min-h-12 shrink-0 items-center gap-1.5 px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#a81414] sm:min-h-14 sm:gap-2 sm:px-4 sm:text-sm md:px-5 ${
                  active
                    ? "bg-[#6b0b0b] text-white"
                    : "text-[#604b42] hover:bg-[#f3e8d4] hover:text-[#6b0b0b]"
                }`}
              >
                {item.label}
                <ChevronRight
                  className={`size-3.5 transition-transform group-hover:translate-x-0.5 ${
                    active ? "text-[#e7c968]" : "text-[#b89a46]"
                  }`}
                />
                {active ? (
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-[#e7c968]" />
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
