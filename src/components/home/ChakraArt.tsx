/**
 * Premium "active chakra" energy art — a glowing spine of the seven
 * chakras over slowly rotating sacred geometry. Pure SVG + CSS, so it
 * stays crisp at every size and honours reduced-motion preferences.
 */

const CHAKRAS: { color: string; glow: string; label: string }[] = [
  { color: "#c0392b", glow: "rgba(192,57,43,.75)", label: "Root" },
  { color: "#e67e22", glow: "rgba(230,126,34,.75)", label: "Sacral" },
  { color: "#ddb829", glow: "rgba(221,184,41,.8)", label: "Solar" },
  { color: "#4c9a6f", glow: "rgba(76,154,111,.75)", label: "Heart" },
  { color: "#3d8fb5", glow: "rgba(61,143,181,.75)", label: "Throat" },
  { color: "#5b5ea6", glow: "rgba(91,94,166,.75)", label: "Third eye" },
  { color: "#9b59b6", glow: "rgba(155,89,182,.8)", label: "Crown" },
];

export default function ChakraArt({ className }: { className?: string }) {
  const cx = 100;
  const top = 26;
  const gap = 21.4;

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-2xl ${className ?? ""}`}
    >
      {/* Deep charcoal energy field */}
      <div className="absolute inset-0 bg-charcoal" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% 42%, rgba(221,184,41,.28), transparent 62%), radial-gradient(ellipse 55% 45% at 50% 100%, rgba(180,20,20,.22), transparent 65%)",
        }}
      />

      {/* Rotating sacred geometry behind the spine */}
      <svg
        viewBox="0 0 200 200"
        className="absolute left-1/2 top-1/2 h-[62%] w-auto -translate-x-1/2 -translate-y-1/2 animate-spin-slow opacity-[0.5]"
      >
        <g fill="none" stroke="#ddb829" strokeWidth="0.6">
          <circle cx="100" cy="100" r="46" opacity="0.5" />
          <circle cx="100" cy="100" r="34" opacity="0.35" />
          {/* Upward + downward triangles — the Shakti star */}
          <polygon points="100,54 139,121 61,121" opacity="0.65" />
          <polygon points="100,146 61,79 139,79" opacity="0.65" />
        </g>
        {/* Lotus petals */}
        <g fill="none" stroke="#ddb829" strokeWidth="0.45" opacity="0.4">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            const x1 = 100 + Math.cos(a) * 48;
            const y1 = 100 + Math.sin(a) * 48;
            const x2 = 100 + Math.cos(a) * 58;
            const y2 = 100 + Math.sin(a) * 58;
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
            );
          })}
        </g>
      </svg>

      {/* Active chakra spine */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[78%] w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent">
          {CHAKRAS.map((c, i) => {
            const y = top + i * gap; // percentage along the spine
            return (
              <span
                key={c.label}
                className="absolute left-1/2 block h-3.5 w-3.5 -translate-x-1/2 rounded-full animate-pulse-gold"
                style={{
                  top: `${y}%`,
                  background: `radial-gradient(circle at 35% 35%, #fff9, ${c.color} 58%)`,
                  boxShadow: `0 0 10px 2px ${c.glow}, 0 0 26px 6px ${c.glow}`,
                  animationDelay: `${i * 0.42}s`,
                }}
                title={c.label}
              />
            );
          })}
        </div>
      </div>

      {/* Fine gold frame */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-gold/25" />
      <div className="pointer-events-none absolute inset-2 rounded-xl border border-gold/10" />
    </div>
  );
}
