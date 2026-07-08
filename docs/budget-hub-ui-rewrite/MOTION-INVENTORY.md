# Budget Hub Motion Inventory

All motion respects `prefers-reduced-motion` via Motion `useReducedMotion`.

| ID | Element | Trigger | Animation | Duration | Easing |
|----|---------|---------|-----------|----------|--------|
| M-01 | Page sections | inView | opacity 0→1, y 24→0 | 500ms | easeOut |
| M-02 | Hero content | mount | stagger children y 32→0 | 600ms | [0.25,0.4,0,1] |
| M-03 | Card hover | pointer | y 0→-2, shadow increase | 200ms | easeOut |
| M-04 | Card image | group-hover | scale 1→1.03 | 500ms | easeInOut |
| M-05 | Nav scroll | scrollY>8 | backdrop + shadow | 150ms | linear |
| M-06 | Category pill | select | background fill | 200ms | easeOut |
| M-07 | Reading progress | scroll | width 0→100% | spring | stiffness 120 |
| M-08 | Search focus | focus | ring opacity | 150ms | easeOut |
| M-09 | Skeleton | loading | pulse opacity | 1.5s | infinite |
| M-10 | Empty state | mount | fade in | 300ms | easeOut |

**Prohibited:** parallax, bounce, dashboard slide-overs, LMS tab swoops.
