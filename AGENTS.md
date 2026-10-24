<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project agent skills

Project-specific skills are available in `.agents/skills/` and tracked in
`skills-lock.json`.

- Before starting a task, check whether a relevant project skill exists.
- If a skill matches the task, read its complete `SKILL.md` before making changes
  and follow its workflow and referenced resources.
- Use only the minimum set of skills needed for the task. If multiple skills
  apply, state the order in which they will be used.
- Prefer the project-local skill over a similarly named global skill.
- Do not edit generated or vendored skill files unless the task explicitly asks
  to update a skill.
