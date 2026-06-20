import { create } from "zustand"
import { axiosRequest, useLoginStore } from "@/store/AuthStore/LoginStore"

export interface UserProfile {
  id: string
  name: string
  email: string
  created_at: string
}

interface ProfileState {
  user: UserProfile | null
  isLoading: boolean
  error: string | null
  fetchProfile: () => Promise<void>
  updateProfile: (newName: string) => Promise<boolean>
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>
}

const syncUserEverywhere = (userData: UserProfile) => {
  localStorage.setItem("user", JSON.stringify(userData))
  useLoginStore.setState({ user: userData })
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosRequest.get<UserProfile>("/users/me")
      set({ user: response.data, isLoading: false })
      syncUserEverywhere(response.data)
    } catch (err: any) {
      console.error("Fetch profile failed:", err)
      const errMsg = err.response?.data?.error || "Failed to load profile data"
      set({ error: errMsg, isLoading: false })
    }
  },

  updateProfile: async (newName: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosRequest.patch<UserProfile>("/users/me", { name: newName })
      set({ user: response.data, isLoading: false })
      syncUserEverywhere(response.data)
      return true
    } catch (err: any) {
      console.error("Update profile failed:", err)
      const errorMsg = err.response?.data?.error || "Failed to update profile name"
      set({ error: errorMsg, isLoading: false })
      return false
    }
  },

  changePassword: async (oldPass: string, newPass: string) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (oldPass === newPass) {
        set({ error: "New password cannot be the same as old password", isLoading: false })
        return false
      }
      set({ isLoading: false })
      return true
    } catch (err: any) {
      set({ error: "Password update failed", isLoading: false })
      return false
    }
  }
}))