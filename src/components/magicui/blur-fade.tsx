"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useInView, Variants } from "framer-motion";
import { useRef, useMemo } from "react";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

const BlurFade = ({
  children,
  className,
  variant,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  inView = false,
  inViewMargin = "-50px",
  blur = "6px",
}: BlurFadeProps) => {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { 
    once: true, 
    margin: inViewMargin as any,
    amount: 0.3 
  });
  const isInView = inView ? inViewResult : true;
  
  // Memoize variants to prevent unnecessary re-renders
  const defaultVariants: Variants = useMemo(() => ({
    hidden: { 
      y: yOffset, 
      opacity: 0, 
      filter: `blur(${blur})`,
      scale: 0.95
    },
    visible: { 
      y: 0, 
      opacity: 1, 
      filter: "blur(0px)",
      scale: 1
    },
  }), [yOffset, blur]);
  
  const combinedVariants = variant || defaultVariants;
  
  // Memoize transition config
  const transition = useMemo(() => ({
    delay: delay,
    duration,
    ease: [0.4, 0.0, 0.2, 1] as const, // Custom easing for smoother animation
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  }), [delay, duration]);
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        exit="hidden"
        variants={combinedVariants}
        transition={transition}
        className={cn(className)}
        // Optimize for performance
        style={{ willChange: 'transform, opacity, filter' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default BlurFade;
