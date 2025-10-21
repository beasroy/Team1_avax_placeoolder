"use client";

import { motion } from "framer-motion";

interface LetterPopProps {
  children: React.ReactNode;
}

export default function LetterPop({ children }: LetterPopProps) {
  return (
    <motion.span
      whileHover={{
        y: -4,
        scale: 1.05,
        textShadow: "0 6px 12px rgba(255,80,80,0.18)"
      }}
      transition={{
        type: "spring",
        stiffness: 360,
        damping: 24
      }}
      className="inline-block px-[2px] font-black"
    >
      {children}
    </motion.span>
  );
}
