'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
      } else {
        // Redirect based on user type
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
            router.push('/client/dashboard') // Default to client dashboard
        }
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري توجيهك إلى لوحة التحكم المناسبة...</p>
      </div>
    </div>
  )
}
