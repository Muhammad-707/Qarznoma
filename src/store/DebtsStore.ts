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

export interface UpcomingDueItem {
  id: string
  amount: number
  currency: string
  direction: string
  due_date: string
  status: string
  contact_name: string
}

export interface Summary {
  totals: {
    they_owe_me: number
    i_owe_them: number
  }
  outstanding: {
    they_owe_me: number
    i_owe_them: number
    net_balance: number
  }
  counts: {
    pending: number
    partial: number
    paid: number
    total: number
  }
  contacts_count: number
  upcoming_due: UpcomingDueItem[]
}

interface DebtsState {
  debts: Debt[]
  summary: Summary | null
  contacts: Contact[]
  folders: Folder[]
  paymentsMap: Record<string, number>
  isLoading: boolean
  errorText: string | null
  fetchDebtsPageData: (silent?: boolean) => Promise<void>
  addDebt: (payload: any) => Promise<void>
  deleteDebt: (id: string) => Promise<void>
  updateDebtStatus: (id: string, status: string) => Promise<void>
  updateDebt: (id: string, payload: any) => Promise<void> 
  addDebtPayment: (debtId: string, amount: number, note: string) => Promise<void>
  addContact: (name: string) => Promise<Contact>
  addFolder: (name: string, color: string) => Promise<Folder>
}

export const useDebtsStore = create<DebtsState>((set, get) => ({
  debts: [],
  summary: null,
  contacts: [],
  folders: [],
  paymentsMap: {},
  isLoading: false,
  errorText: null,

  fetchDebtsPageData: async (silent = false) => {
    if (!silent) {
      set({ isLoading: true, errorText: null })
    }
    try {
      const [debtsRes, summaryRes, contactsRes, foldersRes] = await Promise.all([
        axiosRequest.get("debts"),
        axiosRequest.get("dashboard/summary"),
        axiosRequest.get("contacts"),
        axiosRequest.get("folders")
      ])

      const debtsList = debtsRes.data as Debt[]
      const tempPaymentsMap: Record<string, number> = {}

      await Promise.all(
        debtsList.map(async (debt) => {
          try {
            const res = await axiosRequest.get(`debts/${debt.id}/payments`)
            const payments = res.data || []
            const totalPaid = payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0)
            tempPaymentsMap[debt.id] = totalPaid
          } catch (err) {
            console.error(`Failed to load payments for debt ${debt.id}:`, err)
            tempPaymentsMap[debt.id] = 0
          }
        })
      )

      set({
        debts: debtsList,
        summary: summaryRes.data,
        contacts: contactsRes.data,
        folders: foldersRes.data,
        paymentsMap: tempPaymentsMap,
        isLoading: false
      })
    } catch (error: any) {
      console.error("Debts page fetch error:", error)
      set({ isLoading: false, errorText: "Failed to load debts data." })
    }
  },

  addDebt: async (payload) => {
    try {
      await axiosRequest.post("debts", payload)
      await get().fetchDebtsPageData(true)
    } catch (error: any) {
      console.error("Add debt error:", error)
      throw error
    }
  },

  deleteDebt: async (id) => {
    try {
      await axiosRequest.delete(`debts/${id}`)
      await get().fetchDebtsPageData(true)
    } catch (error) {
      console.error("Delete debt error:", error)
      throw error
    }
  },

  updateDebtStatus: async (id, status) => {
    try {
      await axiosRequest.patch(`debts/${id}`, { status })
      await get().fetchDebtsPageData(true)
    } catch (error) {
      console.error("Update debt status error:", error)
      throw error
    }
  },

  updateDebt: async (id, payload) => {
    try {
      await axiosRequest.patch(`debts/${id}`, payload)
      await get().fetchDebtsPageData(true)
    } catch (error) {
      console.error("Update debt error:", error)
      throw error
    }
  },

  addDebtPayment: async (debtId, amount, note) => {
    try {
      await axiosRequest.post(`debts/${debtId}/payments`, {
        amount: Number(amount),
        note: note || "Debt payment",
        paid_at: new Date().toISOString()
      })
      await get().fetchDebtsPageData(true)
    } catch (error) {
      console.error("Add payment error:", error)
      throw error
    }
  },

  addContact: async (name) => {
    try {
      const { data } = await axiosRequest.post("contacts", { name })
      const contactsRes = await axiosRequest.get("contacts")
      set({ contacts: contactsRes.data })
      return data
    } catch (error) {
      console.error("Failed to add contact:", error)
      throw error
    }
  },

  addFolder: async (name, color) => {
    try {
      const { data } = await axiosRequest.post("folders", { name, color })
      const foldersRes = await axiosRequest.get("folders")
      set({ folders: foldersRes.data })
      return data
    } catch (error) {
      console.error("Failed to add folder:", error)
      throw error
    }
  }
}))