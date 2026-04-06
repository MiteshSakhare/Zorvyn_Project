import React, { useState } from 'react'
import ErrorIcon from '@mui/icons-material/Error'
import SecurityIcon from '@mui/icons-material/Security'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    if (!result.success) {
      setError(result.error)
      toast.error(result.error || 'Authentication failed')
    } else {
      toast.success(`Welcome back, ${result.user?.full_name || 'Operator'}!`)
      navigate('/dashboard', { replace: true })
    }

    setLoading(false)
  }

  const fillCredentials = (e, p) => {
    setEmail(e)
    setPassword(p)
    toast.success('Credentials auto-filled!', { icon: '🔑', duration: 1500 })
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-transparent rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>

          {/* Header */}
          <div className="text-center mb-8 lg:mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-xl shadow-primary-500/20 mb-5 lg:mb-6">
              <SecurityIcon className="text-white" sx={{ fontSize: 28 }} />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-surface-900 dark:text-surface-50 tracking-tight mb-2">Zorvyn</h1>
            <p className="text-surface-500 font-medium tracking-tight text-sm">Enterprise Ledger Access</p>
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
              <label className="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2.5">Email Address</label>
              <div className="relative group/input">
                <EmailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within/input:text-primary-500 transition-colors" sx={{ fontSize: 18 }} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-sans"
                  placeholder="admin@zorvyn.ai"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2.5">
                <label className="block text-[11px] font-black text-surface-500 uppercase tracking-widest">Master Password</label>
              </div>
              <div className="relative group/input">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within/input:text-primary-500 transition-colors" sx={{ fontSize: 18 }} />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all font-sans"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full group flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3.5 lg:py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-primary-500/20 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Authenticate
                  <ArrowForwardIcon sx={{ fontSize: 18 }} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Register link */}
          <div className="text-center mt-8 lg:mt-10">
            <p className="text-surface-500 text-sm font-medium">
              New system operative?{' '}
              <Link
                to="/register"
                className="text-primary-600 dark:text-primary-400 hover:text-surface-900 dark:hover:text-surface-50 font-bold underline underline-offset-4 decoration-2 decoration-primary-500/40"
              >
                Request Access
              </Link>
            </p>
          </div>

          {/* Demo credentials — clickable auto-fill */}
          <div className="mt-8 lg:mt-10 pt-6 lg:pt-8 border-t border-surface-200 dark:border-surface-800">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-surface-200 dark:bg-surface-800"></div>
              <p className="text-surface-400 text-[10px] uppercase font-black tracking-widest">Quick Access</p>
              <div className="h-px flex-1 bg-surface-200 dark:bg-surface-800"></div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { r: 'Administrator', e: 'admin@finance.com', p: 'Admin@123' },
                { r: 'Analyst', e: 'analyst@finance.com', p: 'Analyst@123' },
                { r: 'Viewer', e: 'viewer@finance.com', p: 'Viewer@123' }
              ].map((acc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => fillCredentials(acc.e, acc.p)}
                  className="flex justify-between items-center p-2.5 rounded-xl border border-surface-200 dark:border-surface-800 group/row hover:border-primary-500/40 transition-all bg-surface-50 dark:bg-surface-900 cursor-pointer active:scale-[0.98] text-left w-full"
                >
                  <div>
                    <p className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-tighter mb-0.5">{acc.r}</p>
                    <p className="text-surface-900 dark:text-surface-50 text-[11px] font-semibold">{acc.e}</p>
                  </div>
                  <code className="text-surface-500 text-[10px] font-mono group-hover/row:text-primary-500 transition-colors">{acc.p}</code>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
