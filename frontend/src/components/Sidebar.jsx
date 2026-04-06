import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptIcon from '@mui/icons-material/Receipt'
import GroupIcon from '@mui/icons-material/Group'
import SecurityIcon from '@mui/icons-material/Security'
import CloseIcon from '@mui/icons-material/Close'
import { useAuth } from '../context/AuthContext'
import { RoleGuard } from './RoleGuard'
import { motion } from 'framer-motion'

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const location = useLocation()

  const menuItems = [
    { icon: DashboardIcon, label: 'Dashboard', path: '/dashboard', roles: ['viewer', 'analyst', 'admin'] },
    { icon: ReceiptIcon, label: 'Transactions', path: '/transactions', roles: ['viewer', 'analyst', 'admin'] },
    { icon: GroupIcon, label: 'Users', path: '/users', roles: ['admin'] },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-surface-100/95 dark:bg-surface-900/95 backdrop-blur-xl
        border-r border-surface-200 dark:border-surface-800
        flex flex-col h-screen p-6 transition-all duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-xl text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-200 dark:hover:bg-surface-800 transition-all"
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </button>

        {/* Brand */}
        <div className="mb-10 px-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <SecurityIcon className="text-white" sx={{ fontSize: 24 }} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-50">Zorvyn</h1>
          </div>
          <p className="text-surface-500 text-xs font-medium uppercase tracking-widest pl-1">Finance cockpit</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 relative">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <RoleGuard key={item.path} roles={item.roles}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group"
                >
                  {/* Animated active pill background */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-pill"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500/12 to-primary-500/5 dark:from-primary-500/15 dark:to-primary-500/5 rounded-xl border-l-[3px] border-primary-500"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <item.icon
                    sx={{ fontSize: 20 }}
                    className={`relative z-10 transition-colors duration-200 ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-surface-500 group-hover:text-primary-500'
                    }`}
                  />
                  <span className={`relative z-10 font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-surface-600 dark:text-surface-400 group-hover:text-surface-900 dark:group-hover:text-surface-50'
                  }`}>
                    {item.label}
                  </span>
                </NavLink>
              </RoleGuard>
            )
          })}
        </nav>

        {/* User card */}
        <div className="mt-auto p-4 rounded-2xl bg-surface-200/60 dark:bg-surface-800/60 border border-surface-300/50 dark:border-surface-700/50 transition-colors backdrop-blur-sm">
          <p className="text-surface-500 text-[10px] uppercase font-bold tracking-wider mb-2">Authenticated as</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400/20 to-primary-600/10 dark:from-primary-400/10 dark:to-primary-600/5 flex items-center justify-center border border-primary-500/20">
              <span className="text-primary-600 dark:text-primary-400 font-bold">{user?.full_name?.charAt(0)}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-surface-900 dark:text-surface-50 font-semibold text-sm truncate">{user?.full_name}</p>
              <p className="text-surface-500 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
