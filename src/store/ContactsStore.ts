import { create } from "zustand"
import { axiosRequest } from "@/store/AuthStore/LoginStore"

export interface Contact {
  id: string
  user_id: string
  folder_id?: string
  name: string
  phone?: string
  email?: string
  note?: string
  created_at: string
  updated_at: string
}

export interface Folder {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export interface Debt {
  id: string
  user_id: string
  contact_id: string
  direction: string 
  amount: number
  currency: string
  description: string
  due_date: string
  status: string
  created_at: string
  updated_at: string
}

interface ContactsState {
  contacts: Contact[]
  folders: Folder[]
  debts: Debt[]
  paymentsMap: Record<string, number>
  isLoading: boolean
  error: string | null
  fetchContactsPageData: (silent?: boolean) => Promise<void>
  createContact: (payload: { name: string; phone?: string; email?: string; note?: string; folder_id?: string }) => Promise<void>
  updateContact: (id: string, payload: { name: string; phone?: string; email?: string; note?: string; folder_id?: string }) => Promise<void>
  deleteContact: (id: string) => Promise<void>
}

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],
  folders: [],
  debts: [],
  paymentsMap: {},
  isLoading: false,
  error: null,

  fetchContactsPageData: async (silent = false) => {
    if (!silent) {
      set({ isLoading: true, error: null })
    }
    try {
      const [contactsRes, foldersRes, debtsRes] = await Promise.all([
        axiosRequest.get("contacts"),
        axiosRequest.get("folders"),
        axiosRequest.get("debts"),
      ])

      const contacts = contactsRes.data
      const folders = foldersRes.data
      const debts = debtsRes.data

      const paymentsMap: Record<string, number> = {}
      await Promise.all(
        debts.map(async (debt: any) => {
          try {
            const paymentsRes = await axiosRequest.get(`debts/${debt.id}/payments`)
            paymentsMap[debt.id] = (paymentsRes.data || []).reduce((sum: number, p: any) => sum + Number(p.amount), 0)
          } catch {
            paymentsMap[debt.id] = 0
          }
        })
      )

      set({ contacts, folders, debts, paymentsMap, isLoading: false })
    } catch (err: any) {
      set({ error: "Failed to load contacts data", isLoading: false })
    }
  },

  createContact: async (payload) => {
    try {
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined && v !== "")
      )
      await axiosRequest.post("contacts", cleanPayload)
      await get().fetchContactsPageData(true) 
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to create contact")
    }
  },

  updateContact: async (id, payload) => {
    try {
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).map(([k, v]) => [k, v === "" ? null : v])
      )
      await axiosRequest.patch(`contacts/${id}`, cleanPayload)
      await get().fetchContactsPageData(true) 
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to update contact")
    }
  },

  deleteContact: async (id) => {
    try {
      await axiosRequest.delete(`contacts/${id}`)
      await get().fetchContactsPageData(true)
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to delete contact")
    }
  },
}))