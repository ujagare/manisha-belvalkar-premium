"use client";

/**
 * Splits every text node inside `root` into per-word `<span class="pw">`
 * elements (preserving existing element structure like gold accent spans)
 * and returns the list of word spans for GSAP to animate.
 */
export function splitWords(root: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];

  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? "";
        if (!text.trim()) return;
        const parts = text.split(/(\s+)/);
        if (parts.length <= 1 && !parts[0]) return;
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part));
            return;
          }
          const w = document.createElement("span");
          w.className = "pw";
          w.textContent = part;
          frag.appendChild(w);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    });
  };

  walk(root);
  words.push(...root.querySelectorAll<HTMLElement>(".pw"));
  return words;
}

/** True when the user prefers reduced motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}