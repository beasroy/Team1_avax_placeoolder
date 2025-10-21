"use client";

import { motion } from "framer-motion";
import { APP_DATA } from "@/data/constants";
import { useSession, signIn, signOut } from "next-auth/react"; 

export default function BlipCard() {
  const { data: session } = useSession();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="relative w-full max-w-3xl bg-clip-padding backdrop-blur-sm bg-black/40 border border-white/6 shadow-lg rounded-2xl p-6"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center-safe">
        <div className="flex items-center justify-center w-28 h-28 md:w-24 md:h-24 bg-gradient-to-tr from-red-500 to-white/30 rounded-xl overflow-hidden flex-shrink-0">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <svg
              width="72"
              height="72"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="8"
                r="3"
                stroke="white"
                strokeWidth="1.2"
                fill="rgba(255,255,255,0.04)"
              />
              <path
                d="M4 20c1.333-3.333 4.667-5 8-5s6.667 1.667 8 5"
                stroke="white"
                strokeWidth="1.2"
                fill="none"
                opacity="0.6"
              />
            </svg>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-lg font-semibold">
              {session?.user?.name || APP_DATA.stages.card.username}
            </div>
            <div className="text-sm opacity-70">
              Status: {session?.user?.username ? `@${session.user.username}` : APP_DATA.stages.card.status}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-2">
            <div>
              <div className="text-xs opacity-60">LEVEL</div>
              <div className="text-2xl font-bold">{session?.user?.level || 1}</div>
            </div>
            <div className="flex-1">
              <div className="text-xs opacity-60">EXP</div>
              <div className="w-full bg-white/6 rounded-full h-3 mt-1 overflow-hidden">
                <div 
                  className="h-3 bg-gradient-to-r from-red-400 to-white/60" 
                  style={{ width: `${session?.user?.exp ? (session.user.exp / 1000) * 100 : 0}%` }}
                />
              </div>
              <div className="text-xs opacity-50 mt-1">
                {session?.user?.exp || 0} / 1000
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            {session ? (
              <button
                onClick={() => signOut()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/40 rounded-lg hover:bg-red-500/30 hover:border-red-400/60 transition-all duration-200 group"
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
                    d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}