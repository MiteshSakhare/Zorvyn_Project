import React, { createContext, useState, useCallback, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('access_token')
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { access_token, user } = response.data
      
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      }
    }
  }, [])

  const register = useCallback(async (email, password, fullName) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        full_name: fullName,
      })
      const { access_token, user } = response.data
      
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
