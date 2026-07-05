# Page Spec: [Page Name]

Parent PRD: [link]  ·  Status: `Draft | Approved | Built | QA'd`

> Every field below is mandatory. Write "N/A — [reason]" if a field truly doesn't apply. Do not leave a field blank.

## 1. Purpose
One sentence: the job this page does.

## 2. Users & Entry Points
- Who arrives here:
- Every entry point (nav link, deep link, redirect after action, notification, etc.) — list all, not just the primary:

## 3. Primary Action
The single thing this page wants the user to do. If you can't name one, the page's purpose (Section 1) is underspecified — fix that first.

## 4. States
Fill in every applicable row. Delete only states that are architecturally impossible (justify briefly), not states that are merely unlikely.

| State | What's shown | What's interactive | What's disabled/hidden |
|---|---|---|---|
| Loading | | | |
| Empty (no data yet) | | | |
| Populated (happy path) | | | |
| Error — network | | | |
| Error — validation | | | |
| Permission-denied | | | |
| [domain-specific state] | | | |

## 5. Data Contract
| Field shown | Source | Type | Behavior if null/missing |
|---|---|---|---|
| | | | |

## 6. Component Map
List every shadcn/ui primitive, composition, or custom component used, and which Component Decision Tree step (Section 4 of MASTER-FRAMEWORK.md) justified it.

| UI element | Component used | Decision tree step | Notes |
|---|---|---|---|
| | | 1 (primitive) / 2 (composition) / 3 (variant) / 4 (custom) | |

## 7. Motion Spec
| Interaction | Motion token (Section 5) | Notes |
|---|---|---|
| | | |

Reduced-motion fallback confirmed: ☐

## 8. Responsive Behavior
| Breakpoint | Layout change | Notes |
|---|---|---|
| sm (mobile) | | |
| md (tablet) | | |
| lg (desktop) | | |
| xl (wide) | | |

## 9. Accessibility
- Focus order:
- ARIA roles needed beyond native semantics:
- Keyboard-only path verified: ☐
- Contrast check (text/background) verified: ☐
- Icon-only controls have accessible labels: ☐

## 10. Edge Cases
| Edge case | Expected behavior |
|---|---|
| Extremely long text/content | |
| Zero results | |
| Max results / pagination boundary | |
| Slow/failed network mid-interaction | |
| Permission changes mid-session | |

## 11. Exit Points
| From | To | Trigger |
|---|---|---|
| | | |

## 12. Sign-off
- [ ] Matches parent PRD scope
- [ ] All states filled (no blanks)
- [ ] Component Decision Tree followed for every element
- [ ] Motion tokens used, no invented values
- [ ] Ready for Gate 4 (Build)
