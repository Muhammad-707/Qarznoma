import { create } from "zustand"
import { axiosRequest } from "./AuthStore/LoginStore"

interface DashboardState {
  summary: any | null
  debts: any[]
  contacts: any[]
  folders: any[]
  isLoading: boolean
  errorText: string | null
  fetchDashboardData: () => Promise<void>
  addDebt: (payload: any) => Promise<void>
  addContact: (name: string) => Promise<any>
  addFolder: (name: string, color: string) => Promise<any>
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  summary: null,
  debts: [],
  contacts: [],
  folders: [],
  isLoading: false,
  errorText: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, errorText: null })
    try {
      const [summaryRes, debtsRes, contactsRes, foldersRes] = await Promise.all([
        axiosRequest.get("/dashboard/summary"),
        axiosRequest.get("/debts"),
        axiosRequest.get("/contacts"),
        axiosRequest.get("/folders")
      ])

      set({
        summary: summaryRes.data,
        debts: debtsRes.data,
        contacts: contactsRes.data,
        folders: foldersRes.data,
        isLoading: false
      })
    } catch (error: any) {
      console.error("Dashboard fetch error:", error)
      set({ 
        isLoading: false, 
        errorText: "Failed to load dashboard data." 
      })
    }
  },

  addDebt: async (payload) => {
    set({ isLoading: true, errorText: null })
    try {
      await axiosRequest.post("/debts", payload)
      await get().fetchDashboardData()
    } catch (error: any) {
      console.error("Failed to add debt:", error)
      set({ isLoading: false, errorText: "Failed to save debt." })
      throw error
    }
  },

  addContact: async (name) => {
    try {
      const { data } = await axiosRequest.post("/contacts", { name })
      const contactsRes = await axiosRequest.get("/contacts")
      set({ contacts: contactsRes.data })
      return data
    } catch (error) {
      console.error("Failed to add contact:", error)
      throw error
    }
  },

  addFolder: async (name, color) => {
    try {
      const { data } = await axiosRequest.post("/folders", { name, color })
      const foldersRes = await axiosRequest.get("/folders")
      set({ folders: foldersRes.data })
      return data
    } catch (error) {
      console.error("Failed to add folder:", error)
      throw error
    }
  }
}))