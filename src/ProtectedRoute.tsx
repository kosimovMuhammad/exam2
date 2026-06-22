import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store'
import { STORAGE_KEYS } from '@/constants';

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

  if (!isAuthenticated && !token) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export function PublicRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

  if (isAuthenticated || token) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
