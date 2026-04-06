import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatCard } from '../components/StatCard'
import { MonthlyTrend } from '../components/charts/MonthlyTrend'
import { CategoryPie } from '../components/charts/CategoryPie'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import BarChartIcon from '@mui/icons-material/BarChart'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { formatCurrency } from '../utils/formatters'

export const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, recentRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/recent'),
        ])
        
        if (!summaryRes.data) {
          throw new Error('Invalid summary response')
        }
        
        setSummary(summaryRes.data)
        // Ensure transactions is always an array
        const transactions = Array.isArray(recentRes.data?.transactions) 
          ? recentRes.data.transactions 
          : []
        setRecentTransactions(transactions)
      } catch (error) {
        const errorMsg = error.response?.data?.detail || error.message || 'Failed to load dashboard data. Please try again.'
        toast.error(errorMsg)
        console.error('Dashboard fetch error:', error)
        // Set default empty values to prevent undefined errors
        setSummary({
          total_income: 0,
          total_expenses: 0,
          net_balance: 0,
          transaction_count: 0,
        })
        setRecentTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-14 h-14 border-[3px] border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-surface-500 text-sm font-medium animate-pulse">Loading financial overview...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 lg:space-y-10"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50 mb-1">Financial Overview</h1>
          <p className="text-surface-500 font-medium text-sm lg:text-base">Monitoring your assets and expenditures in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 px-4 py-2 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-success rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-surface-900 dark:text-surface-50 uppercase tracking-wider">Live</span>
          </div>
        </div>
      </div>

      {/* Summary Cards — staggered entrance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          icon={TrendingUpIcon}
          label="Total Income"
          value={formatCurrency(summary?.total_income || 0)}
          trend="+12.5%"
          color="green"
          delay={0}
        />
        <StatCard
          icon={TrendingDownIcon}
          label="Total Expenses"
          value={formatCurrency(summary?.total_expenses || 0)}
          trend="+3.2%"
          color="red"
          delay={0.1}
        />
        <StatCard
          icon={AccountBalanceWalletIcon}
          label="Net Balance"
          value={formatCurrency(summary?.net_balance || 0)}
          trend="+8.1%"
          color="blue"
          delay={0.2}
        />
        <StatCard
          icon={ReceiptLongIcon}
          label="Transactions"
          value={String(summary?.transaction_count || 0)}
          color="amber"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6 lg:p-8 border border-surface-200 dark:border-surface-800 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h3 className="text-lg lg:text-xl font-bold text-surface-900 dark:text-surface-50 flex items-center gap-2">
              <BarChartIcon className="text-primary-600 dark:text-primary-400" sx={{ fontSize: 22 }} />
              Monthly Growth
            </h3>
          </div>
          <div className="h-[300px] lg:h-[350px]">
            <MonthlyTrend />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6 lg:p-8 border border-surface-200 dark:border-surface-800"
        >
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h3 className="text-lg lg:text-xl font-bold text-surface-900 dark:text-surface-50 flex items-center gap-2">
              <TrendingUpIcon className="text-accent-success" sx={{ fontSize: 22 }} />
              Asset Distribution
            </h3>
          </div>
          <div className="h-[300px] lg:h-[350px]">
            <CategoryPie />
          </div>
        </motion.div>
      </div>

      {/* Recent Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="glass-card border border-surface-200 dark:border-surface-800 overflow-hidden"
      >
        <div className="px-6 lg:px-8 py-5 lg:py-6 border-b border-surface-200 dark:border-surface-800 bg-surface-100/50 dark:bg-surface-900/50 flex items-center justify-between">
          <h3 className="text-lg lg:text-xl font-bold text-surface-900 dark:text-surface-50">Recent Activity</h3>
          <button
            onClick={() => navigate('/transactions')}
            className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors active:scale-95"
          >
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-surface-500 text-[11px] uppercase font-bold tracking-widest bg-surface-50/50 dark:bg-surface-950/30">
                <th className="text-left py-4 px-6 lg:px-8">Date</th>
                <th className="text-left py-4 px-6 lg:px-8">Category</th>
                <th className="text-left py-4 px-6 lg:px-8">Type</th>
                <th className="text-right py-4 px-6 lg:px-8">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200/80 dark:divide-surface-800/80">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="group hover:bg-surface-100/60 dark:hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="py-4 lg:py-5 px-6 lg:px-8 text-surface-500 text-sm tabular-nums">
                      {new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 lg:py-5 px-6 lg:px-8">
                      <div className="flex flex-col">
                        <span className="text-surface-900 dark:text-surface-50 font-semibold text-sm">{tx.category_name}</span>
                        <span className="text-surface-500 text-[10px] uppercase font-bold tracking-tighter">ID: {tx.id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="py-4 lg:py-5 px-6 lg:px-8">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        tx.type === 'income'
                          ? 'bg-accent-success/10 text-accent-success border border-accent-success/20'
                          : 'bg-accent-danger/10 text-accent-danger border border-accent-danger/20'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`py-4 lg:py-5 px-6 lg:px-8 text-right font-bold text-sm tabular-nums ${
                      tx.type === 'income' ? 'text-accent-success' : 'text-accent-danger'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-16 text-surface-500 font-medium italic">
                    No recent transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  )
}
