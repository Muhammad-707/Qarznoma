import { create } from "zustand"
import { axiosRequest } from "@/store/AuthStore/LoginStore"

export interface ManagedUser {
  id: string
  name: string
  email: string
  role: "Admin" | "User"
  created_at: string
}

interface UsersState {
  users: ManagedUser[]
  me: any | null
  isLoading: boolean
  error: string | null
  fetchUsersData: (silent?: boolean) => Promise<void>
  createUser: (name: string, email: string, role: "Admin" | "User") => Promise<void>
  updateUser: (id: string, name: string, email: string, role: "Admin" | "User") => Promise<void>
  deleteUser: (id: string) => Promise<void>
}

const STORAGE_KEY = "debt-tracker-managed-users-v1"

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  me: null,
  isLoading: false,
  error: null,

  fetchUsersData: async (silent = false) => {
    if (!silent) {
      set({ isLoading: true, error: null })
    }
    try {
      const meRes = await axiosRequest.get("users/me")
      const meData = meRes.data

      const storedUsersRaw = localStorage.getItem(STORAGE_KEY)
      let storedUsers: ManagedUser[] = []

      if (storedUsersRaw) {
        storedUsers = JSON.parse(storedUsersRaw)
      } else {
        storedUsers = [
          {
            id: meData.id || "me-id-default",
            name: meData.name || "AA BB",
            email: meData.email || "aa@example.com",
            role: "Admin",
            created_at: meData.created_at || new Date().toISOString()
          },
          {
            id: "user-id-2",
            name: "John Smith",
            email: "john@example.com",
            role: "User",
            created_at: "2026-06-18T10:00:00.000Z"
          },
          {
            id: "user-id-3",
            name: "Jane Miller",
            email: "jane@example.com",
            role: "User",
            created_at: "2026-06-19T08:30:00.000Z"
          }
        ]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storedUsers))
      }

      const updatedUsers = storedUsers.map(u => {
        if (u.id === meData.id || u.email === meData.email) {
          return {
            ...u,
            id: meData.id,
            name: meData.name,
            email: meData.email
          }
        }
        return u
      })

      set({ me: meData, users: updatedUsers, isLoading: false })
    } catch (err: any) {
      console.error("Users page load error:", err)
      set({ error: "Failed to load users data", isLoading: false })
    }
  },

  createUser: async (name, email, role) => {
    try {
      const newUser: ManagedUser = {
        id: "usr-" + Math.random().toString(36).substring(2, 9),
        name,
        email,
        role,
        created_at: new Date().toISOString()
      }

      const currentUsers = [...get().users, newUser]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUsers))
      await get().fetchUsersData(true) 
    } catch (err: any) {
      throw new Error("Failed to create user")
    }
  },

  updateUser: async (id, name, email, role) => {
    try {
      const isMe = get().me?.id === id
      if (isMe) {
        await axiosRequest.patch("users/me", { name, email })
      }

      const currentUsers = get().users.map(u => {
        if (u.id === id) {
          return { ...u, name, email, role }
        }
        return u
      })

      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUsers))
      await get().fetchUsersData(true)
    } catch (err: any) {
      throw new Error("Failed to update user")
    }
  },

  deleteUser: async (id) => {
    try {
      const currentUsers = get().users.filter(u => u.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUsers))
      await get().fetchUsersData(true)
    } catch (err: any) {
      throw new Error("Failed to delete user")
    }
  }
}))