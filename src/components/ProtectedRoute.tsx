'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { LoadingSpinner } from './ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: ReactNode
  allowedUserTypes?: string[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedUserTypes,
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }
      
      if (allowedUserTypes && !allowedUserTypes.includes(user.user_type)) {
        // Redirect to appropriate dashboard based on user type
        switch (user.user_type) {
          case 'engineer':
            router.push('/engineer/dashboard')
            break
          case 'client':
            router.push('/client/dashboard')
            break
          case 'partner':
            router.push('/partner/dashboard')
            break
          case 'admin':
            router.push('/admin/dashboard')
            break
          default:
            router.push('/auth/login')
        }
        return
      }
    }
  }, [user, loading, router, allowedUserTypes, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedUserTypes && !allowedUserTypes.includes(user.user_type)) {
    return null
  }

  return <>{children}</>
}
