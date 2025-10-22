"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import BlipCard from "@/components/BlipCard"

interface AriseLandingFlowProps {}

interface FloatingPoint {
  id: number
  x: number
  y: number
}

export function AriseLandingFlow({}: AriseLandingFlowProps) {
  const { data: session } = useSession()
  const [stage, setStage] = useState<"landing" | "clicking" | "transition" | "complete">("landing")
  const [clickCount, setClickCount] = useState(0)
  const [buttonMessage, setButtonMessage] = useState("Click")
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })
  const [floatingPoints, setFloatingPoints] = useState<FloatingPoint[]>([])
  const [nextPointId, setNextPointId] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      requestAnimationFrame(() => setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top }))
    }

    el.addEventListener("mousemove", onMouseMove)
    return () => {
      el.removeEventListener("mousemove", onMouseMove)
    }
  }, [])

  useEffect(() => {
    if (clickCount >= 1 && clickCount <= 4) {
      setButtonMessage("Click a few more times...")
    } else if (clickCount === 5) {
      setButtonMessage("You're getting closer...")
    } else if (clickCount >= 6 && clickCount <= 8) {
      setButtonMessage("Halfway there...")
    } else if (clickCount === 9) {
      setButtonMessage("Last click...")
    } else if (clickCount === 10) {
      setStage("transition")
    }
  }, [clickCount])

  const addFloatingPoint = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newPoint: FloatingPoint = { id: nextPointId, x, y }

    setFloatingPoints((prev) => [...prev, newPoint])
    setNextPointId((prev) => prev + 1)

    // Remove point after animation completes
    setTimeout(() => {
      setFloatingPoints((prev) => prev.filter((p) => p.id !== newPoint.id))
    }, 1500)
  }

  const handleClick = (e: React.MouseEvent) => {
    addFloatingPoint(e)

    if (stage === "landing") {
      setStage("clicking")
      setClickCount(1)
    } else if (stage === "clicking" && clickCount < 10) {
      setClickCount(clickCount + 1)
    }
  }

  useEffect(() => {
    if (stage === "transition") {
      const timer = setTimeout(() => {
        setStage("complete")
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  // If user is logged in when reaching complete, the parent component will handle navigation

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="min-h-screen w-full  bg-black text-white flex items-center justify-center overflow-hidden relative select-none cursor-pointer"
    >
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
            filter: "blur(12px)",
          }}
        />
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{
            background:
              "radial-gradient(700px 400px at 15% 25%, rgba(255,0,0,0.08), transparent), radial-gradient(600px 350px at 85% 75%, rgba(255,255,255,0.03), transparent)",
          }}
          animate={{ x: mouse.x / 100, y: mouse.y / 150 }}
          transition={{ type: "tween", duration: 0.22 }}
          className="absolute inset-0"
        ></motion.div>
      </div>

      <AnimatePresence>
        {floatingPoints.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -60, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed pointer-events-none font-bold text-red-400 text-xl"
            style={{ left: point.x, top: point.y }}
          >
            +10 Points
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Landing Screen */}
        {stage === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-8 relative z-10"
          >
            <motion.h1
              className="text-6xl md:text-8xl font-black tracking-wider"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              ARISE
            </motion.h1>
            <motion.button
              onClick={handleClick}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05, color: "#ff5050" }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-semibold text-white/70 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none"
            >
              Click
            </motion.button>
          </motion.div>
        )}

        {/* Click Interaction Screen */}
        {stage === "clicking" && (
          <motion.div
            key="clicking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-8 relative z-10"
          >
            <motion.h1
              className="text-6xl md:text-8xl font-black tracking-wider"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              ARISE
            </motion.h1>
            <motion.button
              onClick={handleClick}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.05, color: "#ff5050" }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-semibold text-white/70 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none"
            >
              {buttonMessage}
            </motion.button>
            <div className="text-sm text-red-400/70">{clickCount} / 10</div>
          </motion.div>
        )}

        {/* Transition Screen - Quote */}
        {stage === "transition" && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center px-6 relative z-10"
          >
            <motion.p
              className="text-2xl md:text-4xl font-semibold text-center text-red-400 max-w-3xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Complete quests. Earn points. Unlock rewards. The system favors the relentless.
            </motion.p>
          </motion.div>
        )}

        {/* Complete Screen: Auth gate */}
        {stage === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-6 relative z-10 px-4 w-full"
          >
            {session ? (
              <motion.p
                className="text-xl text-red-400/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Loading dashboard...
              </motion.p>
            ) : (
              <>

              <div className="w-full max-w-7xl">
                <BlipCard />
              </div>
               
                <div className="text-sm text-red-400/70 text-center max-w-md">
                  Stay tuned — more quests, rewards, and features are dropping soon.
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
