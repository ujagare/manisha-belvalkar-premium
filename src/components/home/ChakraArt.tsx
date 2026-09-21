import Image from "next/image";

/**
 * Shakti book display for first carousel slide
 */

export default function ChakraArt({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-2xl ${className ?? ""}`}
    >
      <Image
        src="/images/shakti-book-front.png"
        alt="Shakti Book"
        fill
        className="object-cover"
        priority
      />
      
      {/* Fine gold frame */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-gold/25" />
      <div className="pointer-events-none absolute inset-2 rounded-xl border border-gold/10" />
    </div>
  );
}
