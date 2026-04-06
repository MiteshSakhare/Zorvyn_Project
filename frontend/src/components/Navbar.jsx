import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SearchIcon from '@mui/icons-material/Search'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import MenuIcon from '@mui/icons-material/Menu'
import { motion } from 'framer-motion'

export const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-16 lg:h-[72px] px-4 lg:px-8 flex items-center justify-between border-b border-surface-200/80 dark:border-surface-800/80 bg-surface-50/70 dark:bg-surface-950/70 backdrop-blur-xl sticky top-0 z-30 transition-colors duration-300"
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-200 dark:hover:bg-surface-800 transition-all"
        >
          <MenuIcon sx={{ fontSize: 22 }} />
        </button>

        {/* Search bar */}
        <div className="relative w-full max-w-md group hidden md:block">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" sx={{ fontSize: 18 }} />
          <input
            type="text"
            placeholder="Search records, users, or help..."
            className="w-full bg-surface-100/80 dark:bg-surface-900/80 border border-surface-200 dark:border-surface-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-sans placeholder:text-surface-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-200 dark:hover:bg-surface-800 transition-all active:scale-95 cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
        </button>

        {/* Notifications */}
        <button
          className="p-2.5 rounded-xl text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-200 dark:hover:bg-surface-800 transition-all relative active:scale-95"
          aria-label="Notifications"
        >
          <NotificationsIcon sx={{ fontSize: 20 }} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-danger rounded-full border-2 border-surface-50 dark:border-surface-950"></span>
        </button>

        <div className="h-6 w-px bg-surface-300 dark:bg-surface-700 transition-colors hidden sm:block"></div>

        {/* User profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-surface-900 dark:text-surface-50 leading-tight">{user?.full_name}</p>
            <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-accent-danger hover:bg-accent-danger/10 px-3 py-2 rounded-xl transition-all font-medium border border-transparent hover:border-accent-danger/20 active:scale-95 cursor-pointer"
            aria-label="Sign out"
          >
            <LogoutIcon sx={{ fontSize: 18 }} />
            <span className="hidden lg:inline text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
