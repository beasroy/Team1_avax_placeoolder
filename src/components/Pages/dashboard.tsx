"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Zap, Award } from "lucide-react"

interface DashboardPageProps {
  onLogout?: () => void
  isLoggedIn?: boolean
}

export function DashboardPage({ onLogout, isLoggedIn = true }: DashboardPageProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const userStats = {
    totalExp: 2450,
    expThisMonth: 580,
    pendingExp: 120,
    level: 12,
    nextLevelExp: 3000,
  }

  const recentSubmissions = [
    { id: 1, title: "Attended Web3 Conference", type: "IRL Event", status: "Approved", exp: 150 },
    { id: 2, title: "Hosted Live Coding Session", type: "Virtual Event", status: "Approved", exp: 200 },
    { id: 3, title: "Blog Post on Smart Contracts", type: "Content Creation", status: "Pending", exp: 100 },
  ]

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(239, 68, 68, 0.1), transparent 80%)`,
        }}
      />

      <div className="relative z-10 p-8 space-y-8 max-w-7xl mx-auto pt-24">
        <Card className="bg-gradient-to-br from-red-950/40 to-black border-red-500/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
          <CardContent className="relative z-10 p-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-4xl font-bold text-white border-2 border-red-400/50">
                JD
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">John Doe</h2>
                <p className="text-red-400/60 mt-1">Level {userStats.level} Contributor</p>
                <p className="text-red-400/40 text-sm mt-2">Joined 3 months ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-950/40 to-black border-red-500/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent pointer-events-none" />
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl text-white">Level {userStats.level}</CardTitle>
                <CardDescription className="text-red-400/60">Contributor Status</CardDescription>
              </div>
              <Award className="h-12 w-12 text-red-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400/60 text-sm mb-1">Total EXP</p>
                <p className="text-3xl font-bold text-white">{userStats.totalExp}</p>
              </div>
              <div className="bg-black/40 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400/60 text-sm mb-1">This Month</p>
                <p className="text-3xl font-bold text-white">+{userStats.expThisMonth}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-red-400/60">Level {userStats.level}</span>
                <span className="text-red-400/60">Level {userStats.level + 1}</span>
              </div>
              <div className="w-full bg-black/60 border border-red-500/20 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-500 h-4 rounded-full transition-all shadow-lg shadow-red-500/50"
                  style={{ width: `${(userStats.totalExp / userStats.nextLevelExp) * 100}%` }}
                />
              </div>
              <p className="text-xs text-red-400/60 text-right">
                {userStats.totalExp} / {userStats.nextLevelExp} EXP
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/40 border-red-500/20 hover:border-red-500/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-400">EXP This Month</CardTitle>
              <Zap className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{userStats.expThisMonth}</div>
              <p className="text-xs text-red-400/60 mt-1">+{userStats.pendingExp} pending</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-500/20 hover:border-red-500/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-400">EXP to Next Level</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{userStats.nextLevelExp - userStats.totalExp}</div>
              <p className="text-xs text-red-400/60 mt-1">EXP remaining</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-red-500/20 hover:border-red-500/40 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-400">Pending Review</CardTitle>
              <Award className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{userStats.pendingExp}</div>
              <p className="text-xs text-red-400/60 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card className="bg-black/40 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Submissions</CardTitle>
            <CardDescription className="text-red-400/60">Your latest contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{submission.title}</p>
                    <p className="text-sm text-red-400/60">{submission.type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        submission.status === "Approved"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {submission.status}
                    </span>
                    <span className="font-bold text-red-400">+{submission.exp} EXP</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
