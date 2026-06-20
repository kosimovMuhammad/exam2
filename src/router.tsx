import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import DebtsListPage from '@/pages/debts/DebtsListPage';
import DebtDetailsPage from '@/pages/debts/DebtDetailsPage';
import DebtFormPage from '@/pages/debts/DebtFormPage';
import PaymentsListPage from '@/pages/payments/PaymentsListPage';
import PaymentFormPage from '@/pages/payments/PaymentFormPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import SettingsPage from '@/pages/profile/SettingsPage';
import FoldersPage from '@/pages/folders/FoldersPage';
import NotificationsPage from '@/pages/notifications/NotificationsPage';
import ContactsPage from '@/pages/contacts/ContactsPage';
import AnimationTestPage from '@/pages/AnimationTestPage';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <PublicRoute>
        <ResetPasswordPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'debts',
        children: [
          {
            index: true,
            element: <DebtsListPage />,
          },
          {
            path: 'new',
            element: <DebtFormPage />,
          },
          {
            path: ':id',
            element: <DebtDetailsPage />,
          },
          {
            path: ':id/edit',
            element: <DebtFormPage />,
          },
        ],
      },
      {
        path: 'payments',
        children: [
          {
            index: true,
            element: <PaymentsListPage />,
          },
          {
            path: 'new',
            element: <PaymentFormPage />,
          },
        ],
      },
      {
        path: 'folders',
        element: <FoldersPage />,
      },
      {
        path: 'contacts',
        element: <ContactsPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '/animation',
    element: <AnimationTestPage />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
