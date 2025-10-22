"use client";

import { motion } from "framer-motion";
import { APP_DATA } from "@/data/constants";
import { signIn } from "next-auth/react"; 
import {  UserRound } from "lucide-react";

export default function BlipCard() { 
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="w-full max-w-3xl mx-auto bg-clip-padding backdrop-blur-sm bg-black/40 border border-white/6 shadow-lg rounded-2xl p-6"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center-safe">
        <div className="flex items-center justify-center w-28 h-28 md:w-36 md:h-42 bg-gradient-to-tr from-red-500 to-white/30 rounded-xl overflow-hidden flex-shrink-0">
            <UserRound className="w-12 h-12" />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-lg font-semibold">
              {APP_DATA.stages.card.username}
            </div>
            <div className="text-sm opacity-70">
              Status: {APP_DATA.stages.card.status}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-2">
            <div>
              <div className="text-xs opacity-60">LEVEL</div>
              <div className="text-2xl font-bold">{APP_DATA.stages.card.level}</div>
            </div>
            <div className="flex-1">
              <div className="text-xs opacity-60">EXP</div>
              <div className="w-full bg-white/6 rounded-full h-3 mt-1 overflow-hidden">
                <div 
                  className="h-3 bg-gradient-to-r from-red-400 to-white/60" 
                  style={{ width: `${APP_DATA.stages.card.exp.percentage}%` }}
                />
              </div>
              <div className="text-xs opacity-50 mt-1">
                {APP_DATA.stages.card.exp.current} / 1000
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            
              <button
                onClick={() => signIn("twitter")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black/60 border border-white/20 rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-200 group"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-80 group-hover:opacity-100 transition-opacity"
                >
                  <path
                    d="M3 3l8.4 9.3L3.4 21H6.2l6.1-6.8 5.3 6.8H21l-8.9-11L20.6 3h-2.8l-5.4 6-4.7-6H3z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-sm font-medium">{APP_DATA.stages.social.signInButtonText}</span>
              </button>
          
          </div>
        </div>
      </div>
    </motion.div>
  );
}