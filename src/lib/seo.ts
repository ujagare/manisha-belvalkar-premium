/* ============================================================
   SEO helpers

   These keep metadata inside the limits search engines actually
   display. They are read only by `generateMetadata` / `metadata`
   exports — never by a component — so the copy rendered in the UI
   is untouched.
   ============================================================ */

export const SITE_NAME = "Manisha Belvalkar";

/** Suffix the root layout appends to every page title via `title.template`. */
export const TITLE_SUFFIX = ` | ${SITE_NAME}`;

/** Titles are truncated in search results past roughly this width. */
export const TITLE_MAX = 60;

/**
 * Usable meta description window. Google renders around 155-160 characters on
 * desktop and a little less on mobile, so anything longer is simply cut off
 * mid-sentence in the snippet.
 */
export const DESC_MAX = 158;
export const DESC_MIN = 120;

/**
 * Trim to at most `max` characters on a word boundary, dropping any trailing
 * punctuation so the result never ends mid-word or on a dangling dash.
 */
export function clampText(input: string, max: number): string {
  const text = input.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;

  // Slice one past the limit so a word ending exactly at `max` is kept whole.
  const slice = text.slice(0, max + 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice.slice(0, max);

  return cut.replace(/[\s,;:.!?—–-]+$/, "");
}

/**
 * Meta description for a page. Long hand-written copy is clamped to the
 * display limit; shorter copy is returned unchanged (add an explicit
 * `seoDescription` on the entity when it needs to be longer).
 */
export function metaDescription(text: string, max: number = DESC_MAX): string {
  return clampText(text, max);
}

/**
 * Length a page title will occupy once the root layout appends the brand
 * suffix. Use when a title has to be authored as a plain string.
 */
export function renderedTitleLength(title: string): number {
  return title.length + TITLE_SUFFIX.length;
}
