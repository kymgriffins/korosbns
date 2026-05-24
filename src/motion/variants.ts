import { Variants } from 'motion/react';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const hoverScale: Variants = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  }
};

export const tapScale: Variants = {
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export const float: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const orbitLeft: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const orbitRight: Variants = {
  animate: {
    scale: [1.2, 1, 1.2],
    rotate: [360, 180, 0],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const fadeInUpDelay1: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 }
  }
};

export const fadeInUpDelay2: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2 }
  }
};

export const fadeInUpDelay3: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.3 }
  }
};

export const fadeInDelay5: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, delay: 0.5 }
  }
};


