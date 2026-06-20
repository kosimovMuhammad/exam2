// Auth Types
export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// Debt Types
export interface Debt {
  id: string
  user_id: string
  contact_id: string
  direction: DebtDirection
  amount: number
  currency: string
  description: string | null
  due_date: string | null
  status: DebtStatus
  created_at: string
  updated_at: string
}

export type DebtDirection = "they_owe_me" | "i_owe_them"
export type DebtStatus = "pending" | "partial" | "paid"

export interface CreateDebtInput {
  contact_id: string
  direction: DebtDirection
  amount: number
  currency?: string
  description?: string
  due_date?: string
}

export interface UpdateDebtInput {
  contact_id?: string
  direction?: DebtDirection
  amount?: number
  currency?: string
  description?: string
  due_date?: string
  status?: DebtStatus
}

// Payment Types
export interface Payment {
  id: string
  debt_id: string
  user_id: string
  amount: number
  note: string | null
  paid_at: string
  created_at: string
}

export interface CreatePaymentInput {
  amount: number
  note?: string
  paid_at?: string
}

// Contact Types
export interface Contact {
  id: string
  user_id: string
  folder_id: string | null
  name: string
  phone: string | null
  email: string | null
  note: string | null
  created_at: string
  updated_at: string
}

export interface ContactInput {
  name: string
  phone?: string
  email?: string
  note?: string
  folder_id?: string
}

// Folder Types
export interface Folder {
  id: string
  user_id: string
  name: string
  color: string | null
  created_at: string
  updated_at: string
}

export interface FolderInput {
  name: string
  color?: string
}

// Dashboard Types
export interface DashboardSummary {
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
  upcoming_due: UpcomingDebt[]
}

export interface UpcomingDebt {
  id: string
  amount: number
  currency: string
  direction: DebtDirection
  due_date: string | null
  status: DebtStatus
  contact_name: string
}

// API Error
export interface ApiError {
  statusCode: number
  message: string
  error: string
}
