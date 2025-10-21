"use client";

import { motion } from "framer-motion";

interface QuestBackgroundProps {
  mouse: { x: number; y: number };
  blip: boolean;
}

export default function QuestBackground({ mouse, blip }: QuestBackgroundProps) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{
          background:
            "radial-gradient(700px 400px at 15% 25%, rgba(255,0,0,0.08), transparent), radial-gradient(600px 350px at 85% 75%, rgba(255,255,255,0.03), transparent)"
        }}
        animate={{ x: mouse.x / 100, y: mouse.y / 150 }}
        transition={{ type: "tween", duration: 0.22 }}
        className="absolute inset-0"
      />
      <motion.div
        style={{
          background: "linear-gradient(180deg, rgba(255,0,0,0.03), rgba(0,0,0,0.0))"
        }}
        animate={{ y: blip ? -8 : 0 }}
        transition={{ duration: 0.12 }}
        className="absolute inset-0"
      />
    </div>
  );
}
