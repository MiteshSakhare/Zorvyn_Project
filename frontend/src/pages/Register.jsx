import React, { useState } from 'react'
import ErrorIcon from '@mui/icons-material/Error'
import SecurityIcon from '@mui/icons-material/Security'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import PersonIcon from '@mui/icons-material/Person'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const result = await register(email, password, fullName)

    if (!result.success) {
      setError(result.error)
      toast.error(result.error || 'Registration failed')
    } else {
      toast.success(`Welcome aboard, ${result.user?.full_name || 'Operator'}!`)
      navigate('/dashboard', { replace: true })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Aurora Background */}
      <div className="aurora-bg">
        <div className="aurora-orb"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="glass-card p-8 lg:p-10 shadow-2xl relative overflow-hidden group">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent-success/5 to-transparent rounded-full -ml-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>

          {/* Header */}
          <div className="text-center mb-8 lg:mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-accent-success to-emerald-400 shadow-xl shadow-emerald-500/20 mb-5 lg:mb-6">
              <SecurityIcon className="text-surface-950" sx={{ fontSize: 28 }} />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-surface-900 dark:text-surface-50 tracking-tight mb-2">Initialize</h1>
            <p className="text-surface-500 font-medium tracking-tight text-sm">Create your Zorvyn identity</p>
          </div>

          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-accent-danger/10 border border-accent-danger/20 rounded-xl flex gap-3"
            >
              <ErrorIcon className="text-accent-danger shrink-0" sx={{ fontSize: 20 }} />
              <p className="text-accent-danger text-sm font-semibold leading-tight">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
            <div>
              <label className="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2.5">Full Name</label>
              <div className="relative group/input">
                <PersonIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within/input:text-accent-success transition-colors" sx={{ fontSize: 18 }} />
                <input
                  id="register-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-accent-success focus:ring-4 focus:ring-accent-success/10 transition-all font-sans"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2.5">Email Address</label>
              <div className="relative group/input">
                <EmailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within/input:text-accent-success transition-colors" sx={{ fontSize: 18 }} />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-accent-success focus:ring-4 focus:ring-accent-success/10 transition-all font-sans"
                  placeholder="your.email@zorvyn.ai"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2.5">Password</label>
              <div className="relative group/input">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within/input:text-accent-success transition-colors" sx={{ fontSize: 18 }} />
                <input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-accent-success focus:ring-4 focus:ring-accent-success/10 transition-all font-sans"
                  placeholder="••••••••••••"
                  required
                />
              </div>
              <p className="text-surface-500 text-[10px] font-medium mt-2 pl-1 italic">Minimum 8 characters required</p>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full group flex items-center justify-center gap-2 bg-accent-success hover:bg-emerald-400 text-surface-950 py-3.5 lg:py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-surface-950/20 border-t-surface-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowForwardIcon sx={{ fontSize: 18 }} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <div className="text-center mt-8 lg:mt-10">
            <p className="text-surface-500 text-sm font-medium">
              Already have credentials?{' '}
              <Link
                to="/login"
                className="text-accent-success hover:text-surface-900 dark:hover:text-surface-50 font-bold underline underline-offset-4 decoration-2 decoration-accent-success/40"
              >
                Return to Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
