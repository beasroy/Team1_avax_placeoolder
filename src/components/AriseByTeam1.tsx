"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import QuestBackground from "./QuestBackground";
import BlipCard from "./BlipCard";
import LetterPop from "./LetterPop";
import { APP_DATA } from "@/data/constants";

const TWITTER_URL = APP_DATA.stages.social.twitterUrl;
const title = APP_DATA.title;

interface Point {
  x: number;
  y: number;
  value: number;
  id: number;
}

export default function AriseByTeam1() {
  const [stage, setStage] = useState(0);
  const [blip, setBlip] = useState(false);
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 });
  const [points, setPoints] = useState<Point[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY;
      const now = Date.now();
      if (now - lastScrollTime.current < 350) return;
      if (Math.abs(delta) < 20) return;
      lastScrollTime.current = now;
      if (delta > 0) triggerNext();
      else triggerPrev();
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      requestAnimationFrame(() =>
        setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      );
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStartY.current) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      const now = Date.now();
      if (now - lastScrollTime.current < 350 || Math.abs(delta) < 20) {
        touchStartY.current = null;
        return;
      }
      lastScrollTime.current = now;
      if (delta > 0) triggerNext();
      else triggerPrev();
      touchStartY.current = null;
    };

    const onClick = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pointValue = Math.floor(Math.random() * 10) + 1;
      const id = Date.now() + Math.random();
      setPoints(prev => [...prev.slice(-20), { x, y, value: pointValue, id }]);
      setTimeout(() => setPoints(prev => prev.filter(p => p.id !== id)), 1000);
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("click", onClick);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("click", onClick);
    };
  }, [blip]);

  function triggerNext() {
    if (stage >= 3) return;
    setBlip(true);
    requestAnimationFrame(() => {
      setStage(s => Math.min(3, s + 1));
      setTimeout(() => setBlip(false), 200);
    });
  }

  function triggerPrev() {
    if (stage <= 0) return;
    setBlip(true);
    requestAnimationFrame(() => {
      setStage(s => Math.max(0, s - 1));
      setTimeout(() => setBlip(false), 200);
    });
  }



  const sectionVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96, y: 24 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeInOut" }
    },
    exit: {
      opacity: 0,
      scale: 1.03,
      y: -24,
      transition: { duration: 0.28, ease: "easeInOut" }
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-black text-white relative overflow-hidden select-none"
    >
      <QuestBackground mouse={mouse} blip={blip} />

      <div
        style={{ left: mouse.x - 120, top: mouse.y - 120 }}
        className="pointer-events-none fixed w-[240px] h-[240px] rounded-full mix-blend-screen opacity-50"
      >
        <div
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,80,80,0.45), rgba(255,100,100,0.2) 50%, transparent 90%)",
            width: "100%",
            height: "100%",
            borderRadius: 9999,
            filter: "blur(12px)"
          }}
        />
      </div>

      {points.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: 0 }}
          animate={{ y: -30, opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute text-red-400 font-bold pointer-events-none"
          style={{ left: p.x, top: p.y }}
        >
          {`+${p.value} points`}
        </motion.div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {stage === 0 && !blip && (
            <motion.div
              key="landing"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-4"
            >
              <h1 className="text-[clamp(32px,8vw,120px)] tracking-wider opacity-90 font-orbitron font-black">
                <span className="inline-flex gap-1">
                  {title.split("").map((ch, i) => (
                    <LetterPop key={i}>{ch}</LetterPop>
                  ))}
                </span>
              </h1>
              <div className="text-sm opacity-90">{APP_DATA.stages.landing.subtitle}</div>
            </motion.div>
          )}

          {stage === 1 && !blip && (
            <motion.div
              key="card"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full flex items-center justify-center px-6"
            >
              <BlipCard />
            </motion.div>
          )}

          {stage === 2 && !blip && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
              className="flex flex-col items-center px-6 max-w-2xl text-center gap-4"
            >
              <motion.p
                className="text-xl md:text-3xl font-semibold text-red-400"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {APP_DATA.stages.quote.text}
              </motion.p>
            </motion.div>
          )}

          {stage === 3 && !blip && (
            <motion.div
              key="stay"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-4"
            >
              <div className="text-2xl md:text-4xl font-semibold font-orbitron">
                Stay tuned to know more
              </div>
              <a
                href={TWITTER_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-3 px-5 py-2 rounded-md border border-red-400/40 hover:scale-[1.02] transition-transform"
              >
                {APP_DATA.stages.social.buttonText}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 left-6 text-xs opacity-60">
        {APP_DATA.ui.scrollHint}
      </div>
    </div>
  );
}
