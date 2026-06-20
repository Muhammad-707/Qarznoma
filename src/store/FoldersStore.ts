import { create } from "zustand"
import axios from "axios"
import { useLoginStore, getTokens } from "@/store/AuthStore/LoginStore"

const API_URL = (import.meta.env.VITE_API as string) || "https://debt-back-prod.onrender.com/api"

export interface Folder {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

interface FoldersState {
  folders: Folder[]
  contacts: any[]
  debts: any[]
  paymentsMap: Record<string, number>
  isLoading: boolean
  error: string | null
  fetchFoldersPageData: (silent?: boolean) => Promise<void>
  createFolder: (name: string, color: string) => Promise<void>
  updateFolder: (id: string, name: string, color: string) => Promise<void>
  deleteFolder: (id: string) => Promise<void>
}

const getAuthToken = (): string => {
  try {
    const token = getTokens()
    if (token) return token
  } catch {}
  return localStorage.getItem("accessToken") || localStorage.getItem("token") || ""
}

const getRefreshToken = (): string => {
  return localStorage.getItem("refreshToken") || localStorage.getItem("refresh_token") || ""
}

const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem("accessToken", accessToken)
  localStorage.setItem("refreshToken", refreshToken)
}

const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      useLoginStore.getState().logout?.()
      return false
    }
    const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })
    if (res.data && res.data.accessToken) {
      saveTokens(res.data.accessToken, res.data.refreshToken || refreshToken)
      return true
    }
    useLoginStore.getState().logout?.()
    return false
  } catch {
    useLoginStore.getState().logout?.()
    return false
  }
}

const apiRequest = async (method: "get" | "post" | "patch" | "delete", url: string, data: any = null): Promise<any> => {
  try {
    const token = getAuthToken()
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
    if (method === "get" || method === "delete") {
      return await axios[method](url, config)
    } else {
      return await axios[method](url, data, config)
    }
  } catch (err: any) {
    if (err.response?.status === 401) {
      const success = await refreshAuthToken()
      if (success) {
        const token = getAuthToken()
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
        if (method === "get" || method === "delete") {
          return await axios[method](url, config)
        } else {
          return await axios[method](url, data, config)
        }
      }
    }
    throw err
  }
}

export const useFoldersStore = create<FoldersState>((set, get) => ({
  folders: [],
  contacts: [],
  debts: [],
  paymentsMap: {},
  isLoading: false,
  error: null,

  fetchFoldersPageData: async (silent = false) => {
    if (!silent) {
      set({ isLoading: true, error: null })
    }
    try {
      const [foldersRes, contactsRes, debtsRes] = await Promise.all([
        apiRequest("get", `${API_URL}/folders`),
        apiRequest("get", `${API_URL}/contacts`),
        apiRequest("get", `${API_URL}/debts`),
      ])

      const folders = foldersRes.data
      const contacts = contactsRes.data
      const debts = debtsRes.data

      const paymentsMap: Record<string, number> = {}
      await Promise.all(
        debts.map(async (debt: any) => {
          try {
            const paymentsRes = await apiRequest("get", `${API_URL}/debts/${debt.id}/payments`)
            paymentsMap[debt.id] = paymentsRes.data.reduce((sum: number, p: any) => sum + Number(p.amount), 0)
          } catch {
            paymentsMap[debt.id] = 0
          }
        })
      )

      set({ folders, contacts, debts, paymentsMap, isLoading: false })
    } catch (err: any) {
      set({ 
        error: err.response?.data?.error || "Failed to load folders data", 
        isLoading: false 
      })
    }
  },

  createFolder: async (name, color) => {
    try {
      await apiRequest("post", `${API_URL}/folders`, { name, color })
      await get().fetchFoldersPageData(true)
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to create folder")
    }
  },

  updateFolder: async (id, name, color) => {
    try {
      await apiRequest("patch", `${API_URL}/folders/${id}`, { name, color })
      await get().fetchFoldersPageData(true) 
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to update folder")
    }
  },

  deleteFolder: async (id) => {
    try {
      await apiRequest("delete", `${API_URL}/folders/${id}`)
      await get().fetchFoldersPageData(true) 
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to delete folder")
    }
  },
}))