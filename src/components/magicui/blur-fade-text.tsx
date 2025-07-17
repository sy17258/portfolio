"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, Variants } from "framer-motion";

interface BlurFadeTextProps {
  text: string;
  className?: string;
  delay?: number;
  yOffset?: number;
}
const BlurFadeText = ({
  text,
  className,
  delay = 0,
  yOffset = 8,
}: BlurFadeTextProps) => {
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: "blur(8px)" },
    visible: { y: -yOffset, opacity: 1, filter: "blur(0px)" },
  };

  return (
    <AnimatePresence>
      <motion.span
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={defaultVariants}
        transition={{
          delay,
          duration: 0.4,
          ease: "easeOut",
        }}
        className={cn("inline-block", className)}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
};

export default BlurFadeText;
