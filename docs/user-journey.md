# User Journey
## LMS — Budget Ndio Story

Maps **intent → screens → outcomes**. Use with `information-architecture.md` and `screen-contracts/*`.

---

## Journey map overview

```
DISCOVER → ENROLL → LEARN → REFLECT → PROGRESS → RECOGNIZE
```

| Phase | Learner question | Primary screen | Success signal |
|-------|------------------|----------------|----------------|
| Discover | What can I learn? | Home, Catalogue, Search | Course opened |
| Enroll | Is this for me? | Course Detail | Primary CTA tapped |
| Learn | What do I do now? | Lesson | Video part completed |
| Reflect | Did I understand? | Lesson (inline) | Trivia + reflection done |
| Progress | How am I doing? | Progress, Course Detail | Milestone visible |
| Recognize | What did I earn? | Achievements | Badge unlocked |

---

## Journey A — First-time learner

**Persona:** Civic curious, mobile, 10–15 min session

```
1. Arrives at /learn (Home)
   Goal: Find something relevant
   CTA: Browse catalogue OR tap recommended course

2. /learn/catalogue OR course card
   Goal: Compare courses
   CTA: Open course detail

3. /learn/courses/[slug]
   Goal: Decide to enroll
   Why CTA here: Enrollment is the commitment gate before video
   CTA: Enroll & start learning

4. /learn/courses/.../lessons/[slug]
   Goal: Watch first video part
   CTA: (implicit play) → Trivia → Continue

5. Loop: Part 2 → Trivia → … → Reflection → Continue → Next lesson

6. Module complete (inline celebration)
   Exit: Course page OR next lesson

7. Course complete
   Exit: Certificate (v2) · Achievements
```

**Time budget:** 15 min to first trivia complete.

---

## Journey B — Returning learner (primary)

**Persona:** Has in-progress course, 1-tap intent

```
1. /learn (Home)
   First element: Continue Learning card
   Why: Law 1 — ≤2 taps to lesson

2. Tap Continue → Lesson (resume)
   Goal: Pick up at last part
   CTA: Continue (sticky when step complete)

3. Complete session → Home or exit
```

**Time budget:** < 5 sec to video from Home.

---

## Journey C — Progress check

```
1. Bottom nav → Progress
2. Scan course progress bars
3. Tap course continue OR open course detail
4. Resume lesson OR review modules
```

**Why Progress exists:** Motivation without entering lesson. Secondary to Continue on Home.

---

## Journey D — Search-led

```
1. Top nav Search OR /learn/search
2. Type query → grouped results
3. Deep link to Course | Module | Lesson
4. If Lesson: immersive flow (Journey B loop)
```

---

## Journey E — Achievement moment

```
1. Trigger: trivia correct, lesson complete, streak (inline)
2. Optional: Bottom nav → Achievements
3. View unlocked vs locked badges
4. Return via hub nav — no dead end
```

---

## Emotional arc

| Moment | Feeling | UI responsibility |
|--------|---------|-------------------|
| Home | Oriented | One obvious continue path |
| Course | Informed | Hero + collapsed modules |
| Lesson | Focused | No hub chrome |
| Trivia | Challenged | Quick, one question |
| Continue | Momentum | Single forward verb |
| Progress | Accomplished | Milestones, not % alone |

---

## Journey constraints (from Navigation Laws)

- Never more than 2 taps from hub to in-progress lesson
- Never leave lesson page for trivia
- Never lose progress on back
- One primary CTA per viewport in flow screens

## Progressive complexity

Complexity must ascend gradually — see `lms-spec/experience-principles.md` §3.

| Stage | Screen | Level |
|-------|--------|-------|
| Orient | Home | 1 |
| Discover | Catalogue | 2 |
| Decide | Course Detail | 3 |
| Focus | Lesson | 2 |
| Challenge | Trivia | 4 |
| Measure | Progress | 6 |
| Identity | Profile | 7 |

Never expose level N+2 on the same screen as level N.

---

## Journey ↔ screen contracts

| Step | Screen contract |
|------|-----------------|
| Home | `screen-contracts/home.md` |
| Catalogue | `screen-contracts/catalogue.md` |
| Course | `screen-contracts/course-detail.md` |
| Module (optional) | `screen-contracts/module-overview.md` |
| Lesson | `screen-contracts/lesson.md` |
| Progress | `screen-contracts/progress.md` |
| Achievements | `screen-contracts/achievements.md` |
