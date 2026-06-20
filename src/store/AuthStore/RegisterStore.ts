import { create } from "zustand"
import { axiosRequest, saveTokens, useLoginStore } from "@/store/AuthStore/LoginStore" // ИСПРАВЛЕНО: изменен на абсолютный путь
interface RegisterState {
  isLoading: boolean
  errorText: string | null
  register: (obj: any) => Promise<void>
  setErrorText: (error: string | null) => void
}
export const useRegisterStore = create<RegisterState>((set) => ({
  isLoading: false,
  errorText: null,
  setErrorText: (error) => set({ errorText: error }),
  register: async (obj) => {
    set({ isLoading: true, errorText: null })
    try {
      const { data } = await axiosRequest.post("/auth/register", obj)
      saveTokens(data.accessToken, data.refreshToken)
      const loginStore = useLoginStore.getState() as any
      if (loginStore && typeof loginStore.setUser === "function") {
        loginStore.setUser(data.user)
      } else {
        localStorage.setItem("user", JSON.stringify(data.user))
      }
      set({ isLoading: false })
      window.location.href = "/dashboard"
    } catch (error: any) {
      set({ isLoading: false })
      if (error.response?.status === 409) {
        set({ errorText: "Email already registered" })
      } else if (error.response?.status === 422) {
        set({ errorText: error.response.data.error || "Request failed validation" })
      } else {
        set({ errorText: "Something went wrong. Please try again." })
      }
      throw error
    }
  }
}))