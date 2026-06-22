export const STORAGE_KEYS = {
  TOKEN: 'access',
  REFRESH_TOKEN: 'refresh',
  THEME: 'theme',
} as const;

export const APP_NAME = 'DebtTracker Pro'

export const DEBT_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  partial: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
} as const

export const DEBT_DIRECTION_LABELS = {
  they_owe_me: 'They Owe Me',
  i_owe_them: 'I Owe Them',
} as const

export const DEBT_DIRECTION_COLORS = {
  they_owe_me: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  i_owe_them: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
} as const

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
] as const

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  MONTH_YEAR: 'MMMM yyyy',
} as const

export const NAVIGATION_ITEMS = [
  {
    titleKey: 'nav.dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    descriptionKey: 'nav.dashboardDesc',
  },
  {
    titleKey: 'nav.debts',
    href: '/debts',
    icon: 'CreditCard',
    descriptionKey: 'nav.debtsDesc',
  },
  {
    titleKey: 'nav.payments',
    href: '/payments',
    icon: 'Receipt',
    descriptionKey: 'nav.paymentsDesc',
  },
  {
    titleKey: 'contacts.title',
    href: '/contacts',
    icon: 'Users',
    descriptionKey: 'contacts.manageContacts',
  },
  {
    titleKey: 'nav.folders',
    href: '/folders',
    icon: 'Folder',
    descriptionKey: 'nav.foldersDesc',
  },
  {
    titleKey: 'nav.notifications',
    href: '/notifications',
    icon: 'Bell',
    descriptionKey: 'nav.notificationsDesc',
  },
] as const
