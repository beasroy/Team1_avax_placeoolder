"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, X, Wallet, Shield, Bell, Lock, AlertCircle } from "lucide-react"
import { signIn } from "next-auth/react"
import { useProfile } from "@/hooks/useProfile"

export function ProfilePage() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile()
  const [showEmailWarning, setShowEmailWarning] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: ""
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        bio: profile.bio || "",
        email : profile.email || ""
      })
    }
  }, [profile])

  const handleSaveProfile = async () => {
    updateProfile(formData)
  }

  const handleGoogleConnect = () => {
    signIn('google')
  }

  const handleEmailNotificationToggle = () => {
    if (!profile?.email || !profile?.connectedPlatforms?.includes('google')) {
      setShowEmailWarning(true)
      // Scroll to Google connection section
      const googleSection = document.getElementById('google-connection')
      if (googleSection) {
        googleSection.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
  }

  const connectedAccounts = [
    { 
      platform: "Google", 
      connected: profile?.connectedPlatforms?.includes('google') || false, 
      icon: Mail,
      id: 'google-connection'
    },
    { 
      platform: "X (Twitter)", 
      connected: profile?.connectedPlatforms?.includes('twitter') || false, 
      icon: X 
    },
    { 
      platform: "Wallet", 
      connected: false, 
      icon: Wallet 
    },
  ]

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-400/70">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and preferences</p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={profile.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary rounded-full flex items-center justify-center text-3xl">
                  👤
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{profile?.name}</p>
              <p className="text-muted-foreground">
                Level {profile?.level} • {profile?.totalExp} EXP
              </p>
              <p className="text-sm text-muted-foreground mt-1">Joined {profile?.joinDate}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg  text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button 
              className="w-full" 
              onClick={handleSaveProfile}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your authentication methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedAccounts.map((account) => {
            const Icon = account.icon
            return (
              <div
                key={account.platform}
                id={account.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium text-foreground">{account.platform}</span>
                    {account.platform === "Google" && (
                      <p className="text-sm text-muted-foreground">
                        Please connect your email so you can get all updates about submissions
                      </p>
                    )}
                  </div>
                </div>
                <Button 
                  variant={account.connected ? "outline" : "default"} 
                  size="sm"
                  onClick={account.platform === "Google" ? handleGoogleConnect : undefined}
                  disabled={account.platform === "Wallet"}
                >
                  {account.connected ? "Connected" : "Connect"}
                </Button>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Protect your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg opacity-50">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>
            <button
              disabled
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted cursor-not-allowed"
            >
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg opacity-50">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Change
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  {!profile?.email || !profile?.connectedPlatforms?.includes('google') 
                    ? "Connect Google to enable email notifications" 
                    : "Receive updates about your submissions"
                  }
                </p>
              </div>
            </div>
            <button
              onClick={handleEmailNotificationToggle}
              disabled={!profile?.email || !profile?.connectedPlatforms?.includes('google')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                (!profile?.email || !profile?.connectedPlatforms?.includes('google')) 
                  ? "bg-muted cursor-not-allowed opacity-50" 
                  : "bg-muted"
              }`}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1"
              />
            </button>
          </div>
          
          {showEmailWarning && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Please connect your Google account to enable email notifications
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


