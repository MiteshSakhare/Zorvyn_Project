import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import BarChartIcon from '@mui/icons-material/BarChart'
import api from '../../api/axios'
import { formatCurrency } from '../../utils/formatters'

export const MonthlyTrend = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await api.get('/dashboard/trends', { params: { months: 6 } })
        const trends = response.data.trends || []
        if (trends.length === 0) {
          console.warn('No trend data available')
        }
        setData(trends)
      } catch (error) {
        console.error('Failed to load trends:', error.message)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchTrends()
  }, [])

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-full h-4 bg-surface-200 dark:bg-surface-800 animate-pulse rounded-full"></div>
        <div className="w-3/4 h-4 bg-surface-200 dark:bg-surface-800 animate-pulse rounded-full"></div>
        <div className="w-1/2 h-4 bg-surface-200 dark:bg-surface-800 animate-pulse rounded-full"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-surface-500">
        <BarChartIcon sx={{ fontSize: 48 }} className="opacity-20" />
        <p className="font-medium text-sm">No trend data available</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-4 border border-surface-200 dark:border-surface-800 shadow-2xl !bg-white dark:!bg-surface-900">
          <p className="text-surface-500 text-[10px] font-bold uppercase tracking-widest mb-2">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs font-medium text-surface-600 dark:text-surface-400">{entry.name}</span>
                </div>
                <span className="text-sm font-bold text-surface-900 dark:text-surface-50 tabular-nums">{formatCurrency(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 60, bottom: 30 }}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#467eb5" stopOpacity={0.25}/>
            <stop offset="95%" stopColor="#467eb5" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.08)" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
          tickFormatter={(value) => {
            if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
            if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`
            return `₹${value}`
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '16px' }}
          iconType="circle"
          iconSize={8}
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="#467eb5"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#colorIncome)"
          name="Income"
          animationDuration={1500}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#colorExpenses)"
          name="Expenses"
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
