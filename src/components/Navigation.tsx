"use client"

import { Home, FileText, TrendingUp, Users, Settings, Menu, X } from "lucide-react"
import { useState } from "react"

type PageType = "dashboard" | "contribution" | "exp-bounty" | "leaderboard" | "profile"

interface FloatingNavigationProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
  onLogout: () => void
}

export function Navigation({ currentPage, onNavigate, onLogout }: FloatingNavigationProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "contribution", label: "Submit Work", icon: FileText },
    { id: "exp-bounty", label: "Quests", icon: TrendingUp },
    { id: "leaderboard", label: "Leaderboard", icon: Users },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-500/30">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <div className="text-2xl font-black text-white tracking-wider">ARISE</div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id as PageType)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-500/50"
                      : "text-white/70 hover:text-white hover:bg-red-500/20"
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right side - Profile and Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 text-white flex items-center justify-center shadow-lg shadow-red-500/50 hover:shadow-red-500/70 transition-all hover:scale-110 border border-red-500/50 font-bold text-sm"
              >
                U
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 bg-black/95 backdrop-blur-md border border-red-500/30 rounded-lg shadow-lg shadow-red-500/20 overflow-hidden w-56">
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-red-500/20">
                    <p className="text-white font-semibold text-sm">User Profile</p>
                    <p className="text-white/50 text-xs">user@example.com</p>
                  </div>

                  {/* Profile Options */}
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        onNavigate("profile")
                        setIsProfileOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-red-500/20 transition-colors text-sm font-medium"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout()
                        setIsProfileOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-red-500/30 bg-black/90 p-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as PageType)
                    setIsMobileOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                    isActive ? "bg-red-600 text-white" : "text-white/70 hover:text-white hover:bg-red-500/20"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </nav>

      {/* Cursor glow effect */}
      <div
        className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-300"
        id="cursor-glow"
        style={{
          background:
            "radial-gradient(600px at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(239, 68, 68, 0.15), transparent 80%)",
        }}
      />

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('mousemove', (e) => {
              const glow = document.getElementById('cursor-glow');
              if (glow) {
                glow.style.setProperty('--mouse-x', e.clientX + 'px');
                glow.style.setProperty('--mouse-y', e.clientY + 'px');
              }
            });
          `,
        }}
      />
    </>
  )
}
