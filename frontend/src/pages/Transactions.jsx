import React, { useState, useEffect } from 'react'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FilterListIcon from '@mui/icons-material/FilterList'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { formatCurrency, formatDate } from '../utils/formatters'
import { RoleGuard } from '../components/RoleGuard'

export const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const limit = 10
  const [filters, setFilters] = useState({
    type: '',
    category_id: '',
    date_from: '',
    date_to: '',
  })
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories')
        setCategories(res.data || [])
      } catch (error) {
        toast.error('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const purifiedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== '') acc[key] = value
          return acc
        }, {})

        const res = await api.get('/transactions', {
          params: { ...purifiedFilters, page, limit },
        })
        setTransactions(res.data.transactions || [])
        setTotalCount(res.data.total || res.data.transactions?.length || 0)
      } catch (error) {
        toast.error('Failed to load transactions')
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [page, filters])

  const getCategoryName = (id) => {
    const category = categories.find(c => c.id === id)
    return category ? category.name : 'Unknown'
  }

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    try {
      await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
      })
      setShowModal(false)
      setFormData({
        amount: '',
        type: 'expense',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      })
      toast.success('Transaction recorded successfully!')
      setPage(1)
      const res = await api.get('/transactions', { params: { page: 1, limit } })
      setTransactions(res.data.transactions || [])
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add transaction')
    }
  }

  const handleDeleteTransaction = async (id) => {
    // Use toast-based confirmation
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-sm">Delete this transaction?</p>
        <p className="text-xs text-surface-500">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              try {
                await api.delete(`/transactions/${id}`)
                setTransactions(prev => prev.filter(t => t.id !== id))
                toast.success('Transaction deleted')
              } catch (error) {
                toast.error('Failed to delete transaction')
              }
            }}
            className="flex-1 px-3 py-1.5 bg-accent-danger text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 px-3 py-1.5 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-xs font-bold rounded-lg hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 10000, position: 'top-center' })
  }

  const totalPages = Math.ceil(totalCount / limit) || 1

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-14 h-14 border-[3px] border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-surface-500 text-sm font-medium animate-pulse">Syncing transactions...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 lg:space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-surface-900 dark:text-surface-50 mb-1 lg:mb-2">Transactions</h1>
          <p className="text-surface-500 font-medium text-sm lg:text-base">Detailed ledger of all financial movements.</p>
        </div>
        <RoleGuard roles={['analyst', 'admin']}>
          <button
            id="add-transaction-btn"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-95 text-sm"
          >
            <AddIcon sx={{ fontSize: 20 }} />
            Add Transaction
          </button>
        </RoleGuard>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 border border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-2 mb-3 lg:mb-0 lg:hidden">
          <FilterListIcon className="text-surface-500" sx={{ fontSize: 18 }} />
          <span className="text-xs font-bold text-surface-500 uppercase tracking-wider">Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <select
            id="filter-type"
            value={filters.type}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value })
              setPage(1)
            }}
            className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-2.5 lg:py-3 px-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            id="filter-category"
            value={filters.category_id}
            onChange={(e) => {
              setFilters({ ...filters, category_id: e.target.value })
              setPage(1)
            }}
            className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-2.5 lg:py-3 px-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => {
              setFilters({ ...filters, date_from: e.target.value })
              setPage(1)
            }}
            className="bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-2.5 lg:py-3 px-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500"
          />

          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => {
              setFilters({ ...filters, date_to: e.target.value })
              setPage(1)
            }}
            className="bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-2.5 lg:py-3 px-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100]"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              className="glass-card max-w-lg w-full p-6 lg:p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <h2 className="text-xl lg:text-2xl font-black text-surface-900 dark:text-surface-50 tracking-tight">New Transaction</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl text-surface-500 hover:text-accent-danger hover:bg-accent-danger/10 transition-all cursor-pointer"
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-5 lg:space-y-6">
                <div>
                  <label className="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600 dark:text-primary-400 font-bold">₹</span>
                    <input
                      id="txn-amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-3.5 lg:py-4 pl-10 pr-4 text-xl font-black text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2">Category</label>
                    <select
                      id="txn-category"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-3 px-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500"
                      required
                    >
                      <option value="">Select</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2">Type</label>
                    <select
                      id="txn-type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-3 px-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2">Date</label>
                  <input
                    id="txn-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-3 px-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-surface-500 uppercase tracking-widest mb-2">Notes</label>
                  <textarea
                    id="txn-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl py-3 px-4 text-sm text-surface-900 dark:text-surface-50 focus:outline-none focus:border-primary-500 resize-none"
                    rows="2"
                    placeholder="Optional details..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3.5 rounded-xl font-bold bg-surface-200 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-300 dark:hover:bg-surface-700 transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl font-bold bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-[0.98]"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="glass-card border border-surface-200 dark:border-surface-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50/50 dark:bg-surface-950/30 text-surface-500 text-[11px] uppercase font-black tracking-widest border-b border-surface-200 dark:border-surface-800">
                <th className="text-left py-4 px-4 lg:px-8">Date</th>
                <th className="text-left py-4 px-4 lg:px-8">Category</th>
                <th className="text-left py-4 px-4 lg:px-8 hidden sm:table-cell">Type</th>
                <th className="text-right py-4 px-4 lg:px-8">Amount</th>
                <th className="text-left py-4 px-4 lg:px-8 hidden md:table-cell">Notes</th>
                <th className="text-center py-4 px-4 lg:px-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200/80 dark:divide-surface-800/80">
              {transactions.length > 0 ? (
                transactions.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="group hover:bg-surface-100/60 dark:hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="py-4 lg:py-5 px-4 lg:px-8 text-surface-500 text-sm tabular-nums whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 lg:py-5 px-4 lg:px-8">
                      <div className="flex flex-col">
                        <span className="text-surface-900 dark:text-surface-50 font-bold text-sm tracking-tight">{getCategoryName(tx.category_id)}</span>
                        <span className="text-surface-500 text-[10px] uppercase font-bold tracking-tighter">REF: {tx.id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="py-4 lg:py-5 px-4 lg:px-8 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        tx.type === 'income'
                          ? 'bg-accent-success/10 text-accent-success border border-accent-success/20'
                          : 'bg-accent-danger/10 text-accent-danger border border-accent-danger/20'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`py-4 lg:py-5 px-4 lg:px-8 text-right font-bold text-sm tabular-nums whitespace-nowrap ${
                      tx.type === 'income' ? 'text-accent-success' : 'text-accent-danger'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </td>
                    <td className="py-4 lg:py-5 px-4 lg:px-8 hidden md:table-cell">
                      <p className="text-surface-500 text-xs max-w-[200px] truncate font-medium">{tx.notes || '—'}</p>
                    </td>
                    <td className="py-4 lg:py-5 px-4 lg:px-8 text-center">
                      <RoleGuard roles={['admin']}>
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="w-9 h-9 rounded-xl bg-accent-danger/10 text-accent-danger inline-flex items-center justify-center hover:bg-accent-danger hover:text-white transition-all border border-accent-danger/20 cursor-pointer active:scale-90"
                          aria-label="Delete transaction"
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </button>
                      </RoleGuard>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-900 flex items-center justify-center">
                        <ReceiptLongIcon className="text-surface-400" sx={{ fontSize: 32 }} />
                      </div>
                      <p className="text-surface-500 font-medium">No transactions found</p>
                      <p className="text-surface-400 text-sm">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {transactions.length > 0 && (
          <div className="px-4 lg:px-8 py-4 border-t border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-950/30 flex items-center justify-between">
            <p className="text-surface-500 text-xs font-medium">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-surface-200 dark:border-surface-800 text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                aria-label="Previous page"
              >
                <ChevronLeftIcon sx={{ fontSize: 18 }} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-surface-200 dark:border-surface-800 text-surface-500 hover:text-surface-900 dark:hover:text-surface-50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                aria-label="Next page"
              >
                <ChevronRightIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
