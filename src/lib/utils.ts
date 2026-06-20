import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString));
}

export function formatRelativeTime(dateString: string) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const daysDifference = Math.round(
    (new Date(dateString).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  return rtf.format(daysDifference, 'day');
}

export function getInitials(name: string) {
  if (!name) return 'U';
  return name
    .split(' ')
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getDaysUntilDue(dueDate: string) {
  const diff = new Date(dueDate).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getDueDateStatus(dueDate: string) {
  const days = getDaysUntilDue(dueDate);
  if (days < 0) return 'overdue';
  if (days <= 7) return 'due_soon';
  return 'upcoming';
}

// Validations
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});
export type RegisterFormData = z.infer<typeof registerSchema>;

export const profileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
});
export type ProfileFormData = z.infer<typeof profileSchema>;

export const debtSchema = z.object({
  contact_id: z.string().uuid().or(z.string().min(1)),
  amount: z.coerce.number().positive(),
  currency: z.string().optional(),
  direction: z.enum(['they_owe_me', 'i_owe_them']),
  description: z.string().optional(),
  due_date: z.string().optional(),
});
export type DebtFormData = z.infer<typeof debtSchema>;

export const paymentSchema = z.object({
  debt_id: z.string().uuid().optional(),
  amount: z.coerce.number().positive(),
  payment_date: z.string(),
  note: z.string().optional(),
});
export type PaymentFormData = z.infer<typeof paymentSchema>;

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  note: z.string().optional(),
  folder_id: z.string().optional(),
});
export type ContactFormData = z.infer<typeof contactSchema>;
