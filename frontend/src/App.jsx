import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Users } from './pages/Users'
import { ThemeProvider } from './context/ThemeContext'
import { AnimatePresence, motion } from 'framer-motion'

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-50 dark:bg-surface-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500/20 border-t-primary-500"></div>
          <p className="text-surface-500 text-sm font-medium animate-pulse">Initializing Zorvyn...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-50 transition-colors duration-300">
      {/* Aurora ambient background */}
      <div className="aurora-bg">
        <div className="aurora-orb"></div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar onMenuToggle={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 overflow-auto transition-colors duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={
                <div className="text-center py-20">
                  <p className="text-6xl font-black text-surface-200 dark:text-surface-800 mb-4">404</p>
                  <p className="text-surface-500 font-medium">Page not found</p>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}
