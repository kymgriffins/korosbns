# UI Acceptance Questionnaire
## Learning Management System
### Version 1.0

---

# PURPOSE

This questionnaire exists to ensure every implementation faithfully recreates the intended design language.

The implementation is NOT judged by whether it "works".

It is judged by whether it feels identical to the intended experience.

The AI agent MUST answer every question.

---

# SECTION 1
## Overall Philosophy

### Q1

What is the primary focus of every page?

**Expected Answer**

Learning content.

Never navigation.

---

### Q2

Should navigation dominate the interface?

**Expected**

No.

Navigation should disappear into the background.

---

### Q3

What is the visual hierarchy?

**Expected**

Content

↓

Video

↓

Actions

↓

Supporting Information

↓

Metadata

---

### Q4

Should users immediately understand what to do?

**Expected**

Yes.

Every page has exactly one primary action.

---

# SECTION 2
## Layout

### Q5

How many permanent sidebars exist?

**Expected**

Zero.

---

### Q6

How is desktop navigation implemented?

**Expected**

Sticky top navigation.

---

### Q7

How is mobile navigation implemented?

**Expected**

Persistent bottom navigation.

Five icons maximum.

---

### Q8

What is the maximum content width?

**Expected**

1100–1280px.

Centered.

---

### Q9

Should content stretch edge-to-edge?

**Expected**

No.

Content should breathe.

---

### Q10

What spacing system is used?

**Expected**

8-point grid.

Examples

8

16

24

32

48

64

---

# SECTION 3
## Colors

### Q11

Primary background color?

**Expected**

Near White

#FAFAFA

or

#FFFFFF

---

### Q12

Card background?

**Expected**

Pure White

---

### Q13

Border color?

**Expected**

Very subtle

Gray 100-200

---

### Q14

Primary CTA color?

**Expected**

Black

Not blue.

---

### Q15

Hover state?

**Expected**

2–5% darker.

---

### Q16

Primary text color?

**Expected**

Near Black

#111827

---

### Q17

Secondary text?

**Expected**

Gray 500–600.

---

### Q18

Success color?

**Expected**

Green

Used sparingly.

---

### Q19

Warning?

**Expected**

Amber.

---

### Q20

Error?

**Expected**

Red.

---

# SECTION 4
## Typography

### Q21

Font family?

**Expected**

Geist

Inter

SF Pro

---

### Q22

Maximum number of font weights?

**Expected**

Three.

---

### Q23

Should typography create hierarchy instead of colors?

**Expected**

Yes.

---

### Q24

Are paragraphs narrow?

**Expected**

Yes.

Around 65–75 characters.

---

### Q25

Should descriptions be easy to scan?

**Expected**

Yes.

---

# SECTION 5
## Hero Section

### Q26

What appears first?

**Expected**

Breadcrumb

↓

Course Hero

↓

Course Metadata

↓

CTA

---

### Q27

How large is the hero image?

**Expected**

Largest visual element.

Around 60% width.

---

### Q28

What accompanies the hero image?

**Expected**

Course details.

Price (if applicable)

Difficulty

Duration

Language

Students

CTA

---

### Q29

Should metadata be icon driven?

**Expected**

Yes.

---

### Q30

How many CTA buttons?

**Expected**

One primary.

One secondary.

---

# SECTION 6
## Modules

### Q31

Are modules always visible?

**Expected**

Collapsed.

---

### Q32

Can multiple modules remain open?

**Expected**

No.

Accordion behaviour.

---

### Q33

What animation expands modules?

**Expected**

Height animation.

Motion.

200ms.

---

### Q34

Should lessons appear before module expansion?

**Expected**

No.

---

### Q35

Can users understand progression without opening modules?

**Expected**

Yes.

---

# SECTION 7
## Lesson Page

### Q36

What occupies the most space?

**Expected**

Video.

---

### Q37

Should the learner scroll horizontally?

**Expected**

Never.

---

### Q38

Should transcripts appear automatically?

**Expected**

Collapsed.

---

### Q39

Should notes interrupt the lesson?

**Expected**

No.

---

### Q40

Primary CTA?

**Expected**

Continue.

---

# SECTION 8
## Video Experience

### Q41

Video length?

**Expected**

Split into 3–4 parts.

---

### Q42

After each video?

**Expected**

Quick trivia.

---

### Q43

Should users navigate away for quizzes?

**Expected**

Never.

---

### Q44

Should video controls feel native?

**Expected**

Yes.

---

# SECTION 9
## Trivia

### Q45

Trivia presentation?

**Expected**

Popup.

Bottom Sheet.

Modal.

---

### Q46

Questions per interruption?

**Expected**

One.

---

### Q47

Immediate feedback?

**Expected**

Yes.

---

### Q48

Can trivia be dismissed?

**Expected**

No.

Answer required.

---

# SECTION 10
## Motion

### Q49

Animation duration?

**Expected**

150–250ms.

---

### Q50

Animation style?

**Expected**

Spring.

Natural.

---

### Q51

Should every component animate?

**Expected**

No.

Purposeful only.

---

### Q52

Hover scale?

**Expected**

1.02.

---

### Q53

Button press?

**Expected**

0.98.

---

# SECTION 11
## Cards

### Q54

Corner radius?

**Expected**

Large.

12–20px.

---

### Q55

Heavy shadows?

**Expected**

No.

---

### Q56

Borders?

**Expected**

Soft.

---

### Q57

Card padding?

**Expected**

24–32px.

---

# SECTION 12
## Mobile

### Q58

Primary navigation?

**Expected**

Bottom Navigation.

---

### Q59

Sidebar?

**Expected**

Never.

---

### Q60

Video width?

**Expected**

100%.

---

### Q61

Sticky CTA?

**Expected**

Continue button.

---

### Q62

Maximum taps to continue?

**Expected**

One.

---

# SECTION 13
## Accessibility

### Q63

Keyboard accessible?

**Expected**

Yes.

---

### Q64

Visible focus states?

**Expected**

Yes.

---

### Q65

Minimum touch target?

**Expected**

44x44.

---

### Q66

Contrast?

**Expected**

WCAG AA.

---

# SECTION 14
## Architecture

### Q67

Reusable components?

**Expected**

Yes.

---

### Q68

Design tokens?

**Expected**

Required.

---

### Q69

Magic numbers?

**Expected**

None.

---

### Q70

Tailwind utility duplication?

**Expected**

Minimal.

Use component variants.

---

# SECTION 15
## Final Acceptance

The AI must answer:

**Does the implementation visually resemble the supplied reference?**

Yes / No

If No — list every difference.

---

**Does the layout preserve the same whitespace?**

Yes / No

---

**Does the typography create the same visual rhythm?**

Yes / No

---

**Does the course hero occupy the same dominance?**

Yes / No

---

**Does the interface feel minimal?**

Yes / No

---

**Could this be mistaken for the original design language?**

Yes / No

---

If the answer to ANY question is No

**The implementation FAILS.**

The AI must redesign until every answer is Yes.
