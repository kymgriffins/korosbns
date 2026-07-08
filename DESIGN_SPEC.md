# Design System & Component Specification: "Aca." Course Page

## 1. Global Design Tokens

### Colors (Tailwind Zinc Scale)
The design uses a highly neutral, cool grayscale palette.
- **Background:** `bg-white` (`#FFFFFF`)
- **Foreground (Primary Text):** `text-zinc-950` (`#09090B`)
- **Muted (Secondary Text):** `text-zinc-500` (`#71717A`)
- **Muted Foreground (Icons/Borders):** `text-zinc-400` (`#A1A1AA`)
- **Border:** `border-zinc-200` (`#E4E4E7`)
- **Secondary Background (Inputs/Pills):** `bg-zinc-100` (`#F4F4F5`)
- **Primary Action (Buttons):** `bg-zinc-900` / `hover:bg-zinc-800`
- **Accent (Stars):** `text-amber-400` (`#FBBF24`)

### Typography
- **Font Family:** `font-sans` (Inter or Geist Sans recommended).
- **Headings:** `font-semibold` or `font-bold`, `tracking-tight`, `text-zinc-950`.
- **Body:** `font-normal`, `leading-relaxed`, `text-zinc-600`.
- **Captions/Labels:** `text-xs` or `text-sm`, `font-medium`, `text-zinc-500`, `uppercase` (for labels).

### Spacing & Radius
- **Container Max Width:** `max-w-7xl` (1280px) or `max-w-6xl` (1152px).
- **Section Padding:** `px-4 md:px-8 lg:px-12`.
- **Border Radius:**
  - Cards/Images: `rounded-xl` (12px) or `rounded-2xl` (16px).
  - Buttons/Inputs: `rounded-md` (6px) or `rounded-full` (for search/pills).
  - Badges: `rounded-full`.

---

## 2. Layout & Grid Strategy (Mobile First)

### Breakpoints
- **Mobile (`< 768px`):** Single column. Vertical stacking.
- **Tablet (`768px - 1024px`):** Two columns, but sidebar might still stack or use a sticky bottom bar.
- **Desktop (`> 1024px`):** Two columns (7:5 ratio). Sidebar becomes sticky.

### Page Structure
```tsx
// app/courses/[slug]/page.tsx
<main className="min-h-screen bg-white">
  <Navbar />

  <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
    <Breadcrumbs />

    {/* Main Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-6">

      {/* Left Column (Content) */}
      <div className="lg:col-span-7 space-y-8">
        <CourseThumbnail />
        <CourseHeader />
        <CourseDescription />
        <CourseAccordion />
      </div>

      {/* Right Column (Sidebar) */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24 space-y-6">
          <CoursePricingCard />
          <CourseMetaList />
          <CourseActionButtons />
          <CourseInfoCards />
        </div>
      </div>

    </div>
  </div>
</main>
```

---

## 3. Component Specifications & Data Points

### 3.1. Navigation Bar
- **Layout:** `flex items-center justify-between h-16 border-b border-zinc-200 sticky top-0 bg-white/80 backdrop-blur-md z-50`
- **Left:** Logo "Aca." (`text-xl font-bold tracking-tighter`).
- **Center (Desktop):** Links "Courses", "Mentors", "Students" (`text-sm text-zinc-600 hover:text-zinc-950`).
- **Search (Desktop):** `relative w-64`. Input with `Search` icon. `bg-zinc-100 rounded-lg border-none`.
- **Right (Desktop):**
  - Cart Icon + "Cart (3)" (`text-sm`).
  - "Log in" (`text-sm font-medium`).
  - "Create free account" (Button: `border border-zinc-300 bg-white hover:bg-zinc-50 text-sm`).
- **Mobile Adaptation:** Hide Center and Search. Keep Logo left, Cart right. Add Hamburger menu icon (`Menu`) triggering a `shadcn Sheet`.

### 3.2. Breadcrumbs
- **Data:** Home / Courses / Blender courses / Advanced 3D Modelling in Blender
- **Style:** `flex items-center gap-2 text-xs text-zinc-500 mb-6`
- **Separators:** `ChevronRight` icon (`h-3 w-3 text-zinc-300`).
- **Active Item:** `text-zinc-900 font-medium`.

### 3.3. Course Thumbnail (Hero Image)
- **Container:** `relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-100`
- **Image:** `object-cover w-full h-full`.
- **Overlay Badge (Bottom Left/Right):**
  - Avatar: `absolute bottom-4 left-4 h-12 w-12 rounded-full border-2 border-white overflow-hidden`.
  - Rating: `absolute bottom-4 right-4 flex flex-col items-end`.
  - Text: "1,421 reviews" (`text-xs text-white/90 font-medium mb-1`).
  - Stars: 5 stars (`h-4 w-4 text-amber-400 fill-amber-400`).

### 3.4. Course Header & Description
- **Label:** "A course by Blend Smith" (`text-sm text-zinc-500 mb-2`).
- **Title (H1):** "Advanced 3D Modelling in Blender" (`text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 leading-tight`).
- **Description:** Two paragraphs in `text-base text-zinc-600 leading-relaxed space-y-4`.

### 3.5. Course Accordion (Table of Contents)
- **Primitive:** `shadcn Accordion` (`type="single" collapsible`).
- **Header:** "COURSE TABLE OF CONTENTS" (`text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4`).
- **Item Trigger:** `flex justify-between items-center w-full py-4 border-b border-zinc-100 text-base font-medium text-zinc-900`.
- **Item Content:** `text-sm text-zinc-600 mt-2 mb-4`.
- **Icon:** `Plus` / `Minus` from Lucide (`h-4 w-4 text-zinc-400`).

### 3.6. Pricing & Stats Card (Sidebar Top)
- **Price:** "49.99" (`text-4xl font-bold text-zinc-950 tracking-tight`) + "USD" (`text-sm font-medium text-zinc-500 align-top mt-2`).
- **Stats Pills:** `grid grid-cols-2 gap-3 mt-6`.

### 3.7. Meta Info List
- **Layout:** `space-y-3 mt-6 text-sm`.
- **Row Style:** `flex items-center gap-3 text-zinc-600`.
- **Icon Style:** `h-4 w-4 text-zinc-400 shrink-0`.
- **Data Points:** Students, Language, Subtitles, Additional resources, Duration, Critique session, Certificate.

### 3.8. Action Buttons
- **Layout:** `grid grid-cols-2 gap-3 mt-8`.
- **Primary Button:** "Enroll a course" — `bg-zinc-900 text-white hover:bg-zinc-800 h-11 rounded-lg font-medium`.
- **Secondary Button:** "Buy as a gift" — `bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 h-11 rounded-lg font-medium`.

### 3.9. Info Cards (Assignment, Prerequisites, Materials)
- **Layout:** `space-y-6 mt-8`.
- **Header:** `text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2`.
- **Body:** `text-sm text-zinc-600 leading-relaxed`.

---

## 4. Animation & Interaction (Motion)

Use `framer-motion` (or `motion/react`) for subtle premium feel.

### Global Variants
```tsx
// lib/motion.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } }
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};
```

### Component Animations
1. Page Load: Hero & sidebar use stagger + fade up.
2. Scroll Reveal: Description & accordion use in-view fade up.
3. Accordion Item: smooth layout transitions.
4. Button Hover: scale on primary; subtle background shift on secondary.

---

## 5. Mobile-First Adaptation Rules

For `< md`:
1. Reorder critical pricing/actions above long description.
2. Optional sticky bottom CTA for conversion.
3. Typography scaling: H1 `text-2xl md:text-3xl lg:text-4xl`.
4. Touch targets minimum 44px (`h-11`).
5. Thumbnail remains full width.
