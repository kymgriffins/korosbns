# Input border audit (`audit/input-borders`)

## Verdict

**Confirmed:** many fields looked like plain text — light-mode `--input` was pure white.

## Fix applied

1. Light `--input` → `hsl(0 0% 0% / 0.16)` (visible edge); `--border` slightly stronger.
2. Dark `--input` → `oklch(1 0 0 / 22%)` for clearer edges.
3. `Input`, `Textarea`, `SelectTrigger`, `InputGroup` use `bg-background` (light) instead of bare transparent.

Intentionally chrome-less composers (`border-0` chat/task editors) left alone.
