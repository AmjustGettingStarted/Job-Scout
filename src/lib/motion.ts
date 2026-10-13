"use client";

import { useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0 },
  },
};

const reducedFade: Variants = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0, transition: { duration: 0 } },
};

const reducedStagger: Variants = {
  hidden: {},
  show: { transition: { duration: 0 } },
};

export const viewport = { once: true, amount: 0.01 } as const;

export function useMotionVariants() {
  const reduce = useReducedMotion() ?? false;

  return {
    reduce,
    fadeUp: reduce ? reducedFade : fadeUp,
    stagger: reduce ? reducedStagger : stagger,
    section: reduce
      ? { initial: false as const }
      : {
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport,
        },
    enter: reduce
      ? { initial: false as const }
      : { initial: "hidden" as const, animate: "show" as const },
  };
}
