import React, { useState, useEffect } from 'react'
import SecurityIcon from '@mui/icons-material/Security'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api/axios'

export const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users', { params: { page, limit: 10 } })
        setUsers(res.data.users || [])
      } catch (error) {
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [page])

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/users/${userId}/role`, { role: newRole })
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      toast.success(`Role updated to ${newRole}`)
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.patch(`/users/${userId}/status`, { is_active: newStatus })
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: newStatus } : u))
      toast.success(newStatus ? 'User activated' : 'User suspended')
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const handleDeleteUser = async (userId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-sm">Delete this user permanently?</p>
        <p className="text-xs text-surface-500">All their data will be removed.</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              try {
                await api.delete(`/users/${userId}`)
                setUsers(prev => prev.filter(u => u.id !== userId))
                toast.success('User deleted successfully')
              } catch (error) {
                toast.error('Failed to delete user')
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-14 h-14 border-[3px] border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
        <p className="text-surface-500 text-sm font-medium animate-pulse">Loading user directory...</p>
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
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-surface-900 dark:text-surface-50 mb-1 lg:mb-2">Access Control</h1>
          <p className="text-surface-500 font-medium text-sm lg:text-base">Manage administrative privileges and user lifecycle.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary-500/10 border border-primary-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
            <SecurityIcon className="text-primary-600 dark:text-primary-400" sx={{ fontSize: 16 }} />
            <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">RBAC Enabled</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card border border-surface-200 dark:border-surface-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50/50 dark:bg-surface-950/30 text-surface-500 text-[11px] uppercase font-black tracking-widest border-b border-surface-200 dark:border-surface-800">
                <th className="text-left py-4 px-4 lg:px-8">User</th>
                <th className="text-left py-4 px-4 lg:px-8">Role</th>
                <th className="text-left py-4 px-4 lg:px-8 hidden sm:table-cell">Status</th>
                <th className="text-center py-4 px-4 lg:px-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200/80 dark:divide-surface-800/80">
              {users.length > 0 ? (
                users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="group hover:bg-surface-100/60 dark:hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="py-4 lg:py-5 px-4 lg:px-8">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-primary-400/20 to-primary-600/10 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm border border-primary-500/20">
                          {user.full_name.charAt(0)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-surface-900 dark:text-surface-50 font-bold text-sm tracking-tight truncate">{user.full_name}</span>
                          <span className="text-surface-500 text-xs font-medium truncate">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 lg:py-5 px-4 lg:px-8">
                      <div className="relative w-28 lg:w-32 group/select">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg py-2 px-3 text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest appearance-none focus:outline-none focus:border-primary-500 cursor-pointer"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="analyst">Analyst</option>
                          <option value="admin">Admin</option>
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-primary-500 opacity-50 group-hover/select:opacity-100">
                          <EditIcon sx={{ fontSize: 12 }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 lg:py-5 px-4 lg:px-8 hidden sm:table-cell">
                      <button
                        onClick={() => handleStatusChange(user.id, !user.is_active)}
                        className={`inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95 ${
                          user.is_active
                            ? 'bg-accent-success/10 text-accent-success border border-accent-success/20 hover:bg-accent-success/20'
                            : 'bg-surface-200 dark:bg-surface-800 text-surface-500 border border-surface-300 dark:border-surface-700 hover:bg-surface-300 dark:hover:bg-surface-700'
                        }`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-accent-success' : 'bg-surface-500'}`}></div>
                        {user.is_active ? 'Active' : 'Suspended'}
                      </button>
                    </td>
                    <td className="py-4 lg:py-5 px-4 lg:px-8 text-center">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="w-9 h-9 rounded-xl bg-accent-danger/10 text-accent-danger inline-flex items-center justify-center hover:bg-accent-danger hover:text-white transition-all border border-accent-danger/20 mx-auto cursor-pointer active:scale-90"
                        aria-label="Delete user"
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-900 flex items-center justify-center">
                        <GroupIcon className="text-surface-400" sx={{ fontSize: 32 }} />
                      </div>
                      <p className="text-surface-500 font-medium">No users found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
