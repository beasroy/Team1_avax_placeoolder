import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

interface ProfileData {
  name: string
  email: string
  image: string
  bio: string
  joinDate: string
  level: number
  totalExp: number
  connectedPlatforms: string[]
}

const fetchProfile = async (): Promise<ProfileData> => {
  const response = await fetch('/api/profile')
  if (!response.ok) {
    throw new Error('Failed to fetch profile')
  }
  const data = await response.json()
  return data.user
}

export function useProfile() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: fetchProfile,
    enabled: !!session, // Only fetch if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { name: string; bio: string }) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      })
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })

  return {
    profile,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
  }
}
