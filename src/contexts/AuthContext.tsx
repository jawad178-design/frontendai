'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Types
interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: 'client' | 'engineer' | 'partner' | 'admin'
  phone?: string
  profile_image?: string
  is_verified: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_USER'; payload: User }

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (user: User) => void
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
}

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // API base URL - Production URLs for deployment
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://jawad12k-fahsna-backend.hf.space'

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' })

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Store token in localStorage
        localStorage.setItem('authToken', data.access_token)
        localStorage.setItem('refreshToken', data.refresh_token)
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            token: data.access_token,
          },
        })
        
        return true
      } else {
        dispatch({ type: 'LOGIN_FAILURE' })
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      dispatch({ type: 'LOGIN_FAILURE' })
      return false
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    dispatch({ type: 'LOGOUT' })
  }

  // Update user function
  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user })
  }

  // Check for existing token on mount
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem('authToken')
      
      if (token) {
        try {
          // Verify token with backend
          const response = await fetch(`${API_BASE_URL}/api/auth/me/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: userData,
                token,
              },
            })
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('authToken')
            localStorage.removeItem('refreshToken')
            dispatch({ type: 'LOGIN_FAILURE' })
          }
        } catch (error) {
          console.error('Token verification error:', error)
          localStorage.removeItem('authToken')
          localStorage.removeItem('refreshToken')
          dispatch({ type: 'LOGIN_FAILURE' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuthToken()
  }, [API_BASE_URL])

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      return null
    }

    return <Component {...props} />
  }
}
