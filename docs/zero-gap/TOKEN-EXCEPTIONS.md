# Tailwind token exceptions

Arbitrary values (`text-[10px]`, `top-[3.25rem]`) are allowed **only** when listed here with justification. New exceptions require PR note + design lead ack.

| Value | File(s) | Reason | Remove by |
|-------|---------|--------|-----------|
| `top-[3.25rem]` | task form workspace tabs | Mobile chrome offset; replace with `--header-height` token | v0.4.0 |
| `tracking-[0.14em]` | task detail brief | Section kicker style; add `tracking-kicker` token | v0.4.0 |
| `pb-[max(0.75rem,env(safe-area-inset-bottom))]` | task form footer | iOS safe area | Permanent (a11y) |

**Process:** When `goldrules:audit` flags a new arbitrary value, either fix it or add a row here in the same PR.
