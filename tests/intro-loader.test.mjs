import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const loaderSource = await readFile(
  new URL("../src/components/layout/IntroLoader.tsx", import.meta.url),
  "utf8",
);

test("intro loader is not suppressed by persisted browser session state", () => {
  assert.doesNotMatch(loaderSource, /sessionStorage/);
  assert.doesNotMatch(loaderSource, /manisha-intro-seen/);
});

test("intro loader keeps its timed exit and removal", () => {
  assert.match(loaderSource, /setLeaving\(true\), 4200/);
  assert.match(loaderSource, /setVisible\(false\), 5400/);
});
