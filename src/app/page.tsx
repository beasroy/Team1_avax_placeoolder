"use client"

import { AriseLandingFlow } from "@/components/AriseLanding";
import { DashboardPage } from "@/components/Pages/dashboard";
import { ProfilePage } from "@/components/Pages/profile-page";
import { Navigation } from "@/components/Navigation";
import { Loader } from "@/components/Loader";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

type PageType = "intro" | "auth" | "dashboard" | "contribution" | "exp-bounty" | "leaderboard" | "profile"

export default function Home() {
  const { data: session, status } = useSession()
  const [currentPage, setCurrentPage] = useState<PageType>("intro")

  useEffect(() => {
    if (session && currentPage === "intro") {
      setCurrentPage("dashboard")
    }
  }, [session, currentPage])


  if (status === "loading") {
    return (
   
      <div className = "min-h-screen bg-black flex items-center justify-center">
        <Loader />
      </div>
      
    )
  }

  const handleNavigate = (page: Exclude<PageType, "intro" | "auth">) => {
    setCurrentPage(page)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    setCurrentPage("intro") 
  }

  return (
    <>
      {session && (
        <Navigation
          currentPage={(currentPage as unknown) as any}
          onNavigate={handleNavigate as any}
          onLogout={handleLogout}
        />
      )}
      {session ? (
        currentPage === "dashboard" ? (
          <DashboardPage isLoggedIn={!!session} />
        ) : currentPage === "profile" ? (
          <ProfilePage />
        ) : (
          <div>Other pages coming soon...</div>
        )
      ) : (
        <AriseLandingFlow />
      )}
    </>
  )
}
