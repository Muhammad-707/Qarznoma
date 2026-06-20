import { create } from "zustand"
import axios from "axios"

interface User {
  id: string
  name: string
  email: string
  created_at: string
}

interface LoginState {
  user: User | null
  isLoading: boolean
  errorText: string | null
  login: (obj: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  setErrorText: (error: string | null) => void
  setUser: (user: User | null) => void 
}

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem("access", access)
  localStorage.setItem("refresh", refresh)
}

export const getTokens = () => localStorage.getItem("access")
export const getRefreshToken = () => localStorage.getItem("refresh")
export const clearTokens = () => {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  localStorage.removeItem("user")
}

export const getAPIUrl = (path: string): string => {
  const base = import.meta.env.VITE_API || "https://debt-back-prod.onrender.com/api"
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

export const axiosRequest = axios.create({
  baseURL: getAPIUrl("/"),
})

axiosRequest.interceptors.request.use(
  (config) => {
    const token = getTokens()
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const url = originalRequest?.url || ""

    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !url.includes("/auth/login") &&
      !url.includes("/auth/register") &&
      !url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        try {
          console.warn("Access token expired (15 min). Auto-refreshing session...")
          const response = await axios.post(
            getAPIUrl("/auth/refresh"),
            { refreshToken }
          )
          const { accessToken: newAccess, refreshToken: newRefresh } = response.data
          saveTokens(newAccess, newRefresh)
          
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`
          return axiosRequest(originalRequest)
        } catch (refreshError) {
          console.error("Session completely expired. Logging out...")
          clearTokens()
          window.location.href = "/login"
          return Promise.reject(refreshError)
        }
      }
    }
    return Promise.reject(error)
  }
)

const getPersistedUser = (): User | null => {
  const userStr = localStorage.getItem("user")
  try {
    return userStr ? JSON.parse(userStr) : null
  } catch {
    return null
  }
}

export const useLoginStore = create<LoginState>((set) => ({
  user: getPersistedUser(),
  isLoading: false,
  errorText: null,
  setErrorText: (error) => set({ errorText: error }),

  setUser: (newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser))
    } else {
      localStorage.removeItem("user")
    }
    set({ user: newUser }) 
  },
  
  login: async (obj) => {
    set({ isLoading: true, errorText: null })
    try {
      const { data } = await axiosRequest.post("/auth/login", obj)
      saveTokens(data.accessToken, data.refreshToken)
      localStorage.setItem("user", JSON.stringify(data.user))
      
      set({ user: data.user, isLoading: false })
      window.location.href = "/dashboard"
    } catch (error: any) {
      set({ isLoading: false })
      if (error.response?.status === 401) {
        set({ errorText: "Invalid email or password" })
      } else if (error.response?.status === 422) {
        set({ errorText: error.response.data.error || "Validation error" })
      } else {
        set({ errorText: "Connection error. Please try again." })
      }
      throw error
    }
  },

  logout: async () => {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        await axiosRequest.post("/auth/logout", { refreshToken })
      } catch (error) {
        console.error("Logout request failed:", error)
      }
    }
    clearTokens()
    set({ user: null })
    window.location.href = "/login"
  }
}))