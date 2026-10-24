import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readingSource = await readFile(
  new URL("../src/components/shakti/ShaktiCardReading.tsx", import.meta.url),
  "utf8",
);

test("revealed Shakti cards preserve the complete card artwork", () => {
  const revealedCard = readingSource.match(
    /<Image src=\{shaktiCardImagePath\(cardNumber\)\}[\s\S]*?className="([^"]+)"/,
  );

  assert.ok(revealedCard, "expected to find the revealed Shakti card image");
  assert.match(revealedCard[1], /\bobject-contain\b/);
  assert.doesNotMatch(revealedCard[1], /\bobject-cover\b/);
});
