export const APPLE_EASE = [0.22, 1, 0.36, 1] as const;

export const MOTION_VARIANTS = {
  standard: {
    duration: 0.7,
    ease: APPLE_EASE,
  },
  hero: {
    duration: 1.2,
    ease: APPLE_EASE,
  },
  micro: {
    duration: 0.3,
    ease: "easeOut",
  },
};

export const FADE_UP = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: MOTION_VARIANTS.standard,
};

export const STAGGER_CHILDREN = {
  initial: "initial",
  whileInView: "whileInView",
  viewport: { once: true },
  transition: {
    staggerChildren: 0.08,
  },
};
