'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

// API Configuration - Production URLs for deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jawad12k-fahsna-backend.hf.space'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  user_type: 'client' | 'engineer' | 'partner' | 'admin'
  is_active: boolean
  date_joined: string
  profile?: {
    phone?: string
    license_number?: string
    specialization?: string
    years_of_experience?: number
    company_name?: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (userData: RegisterData) => Promise<boolean>
  refreshToken: () => Promise<boolean>
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  user_type: string
  phone?: string
  license_number?: string
  specialization?: string
  company_name?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/users/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('access_token', data.tokens.access)
        localStorage.setItem('refresh_token', data.tokens.refresh)
        
        // Fetch user profile
        await checkAuthStatus()
        return true
      } else {
        const errorData = await response.json()
        console.error('Login error:', errorData)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('access_token', data.tokens.access)
        localStorage.setItem('refresh_token', data.tokens.refresh)
        setUser(data.user)
        return true
      } else {
        const errorData = await response.json()
        console.error('Registration error:', errorData)
        return false
      }
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      // For testing, disable logout API call
      console.log('Logout API call disabled for testing')
      
      // Just clear local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      // Clear storage even if API call fails
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
    }
  }

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refresh = localStorage.getItem('refresh_token')
      if (!refresh) return false

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('access_token', data.access)
        return true
      } else {
        // Refresh token is invalid
        await logout()
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      await logout()
      return false
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
