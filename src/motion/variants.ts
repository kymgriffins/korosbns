import { Variants } from 'motion/react';

// ─── Spring presets ────────────────────────────────────────────────────────────
export const spring = {
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  smooth: { type: 'spring', stiffness: 260, damping: 28 },
  gentle: { type: 'spring', stiffness: 180, damping: 24 },
  bouncy: { type: 'spring', stiffness: 320, damping: 20 },
} as const;

// ─── Easing curves ─────────────────────────────────────────────────────────────
export const ease = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  in: [0.7, 0, 0.84, 0] as [number, number, number, number],
  inOut: [0.83, 0, 0.17, 1] as [number, number, number, number],
  expo: [0.19, 1, 0.22, 1] as [number, number, number, number],
} as const;

// ─── Core variants ─────────────────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: ease.out },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: ease.expo },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: ease.expo },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: spring.smooth,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: ease.expo },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: ease.expo },
  },
};

// ─── Stagger containers ────────────────────────────────────────────────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// ─── Interactive ───────────────────────────────────────────────────────────────
export const hoverScale: Variants = {
  hover: {
    scale: 1.04,
    transition: spring.snappy,
  },
};

export const tapScale: Variants = {
  tap: {
    scale: 0.96,
    transition: spring.snappy,
  },
};

// ─── Ambient / looping ─────────────────────────────────────────────────────────
export const float: Variants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const orbitLeft: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const orbitRight: Variants = {
  animate: {
    scale: [1.2, 1, 1.2],
    rotate: [360, 180, 0],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ─── Page transition ───────────────────────────────────────────────────────────
export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: ease.expo },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(4px)',
    transition: { duration: 0.3, ease: ease.in },
  },
};

// ─── Navbar ────────────────────────────────────────────────────────────────────
export const navbarEnter: Variants = {
  hidden: { opacity: 0, y: -20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: ease.expo, delay: 0.1 },
  },
};

export const navMenuSlide: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.15, ease: ease.in },
  },
};

export const mobileMenuSlide: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: ease.expo },
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: { duration: 0.28, ease: ease.in },
  },
};

// ─── Legacy delay helpers (kept for backward compat) ──────────────────────────
export const fadeInUpDelay1: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1, ease: ease.expo },
  },
};

export const fadeInUpDelay2: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2, ease: ease.expo },
  },
};

export const fadeInUpDelay3: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3, ease: ease.expo },
  },
};

export const fadeInDelay5: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, delay: 0.5, ease: ease.expo },
  },
};
