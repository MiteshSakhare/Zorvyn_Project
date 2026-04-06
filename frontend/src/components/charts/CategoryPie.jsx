import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import api from '../../api/axios'
import { formatCurrency } from '../../utils/formatters'

const COLORS = [
  '#467eb5', // Primary Blue
  '#10b981', // Emerald
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#64748b', // Slate
  '#2b4f7a', // Dark Blue
  '#059669', // Dark Emerald
  '#dc2626', // Dark Red
  '#d97706', // Dark Amber
]

export const CategoryPie = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBreakdown = async () => {
      try {
        const response = await api.get('/dashboard/by-category')
        if (!response.data || !response.data.categories) {
          throw new Error('Invalid response format')
        }
        const pieData = response.data.categories
          .filter(cat => cat.total > 0)
          .map(cat => ({
            name: cat.category_name || 'Uncategorized',
            value: Math.abs(parseFloat(cat.total) || 0),
          }))
        setData(pieData)
      } catch (error) {
        console.error('Failed to load category breakdown:', error.message)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchBreakdown()
  }, [])

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-[3px] border-primary-500/20 border-t-primary-500 animate-spin"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-surface-500">
        <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-900 flex items-center justify-center">
          <TrendingUpIcon sx={{ fontSize: 36 }} className="opacity-20" />
        </div>
        <p className="font-medium italic text-sm">No category data available</p>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const total = data.reduce((a, b) => a + b.value, 0)
      return (
        <div className="glass-card p-4 border border-surface-200 dark:border-surface-800 shadow-2xl !bg-white dark:!bg-surface-900">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
            <p className="text-surface-900 dark:text-surface-50 text-xs font-bold uppercase tracking-wider">{payload[0].name}</p>
          </div>
          <p className="text-lg font-black text-surface-900 dark:text-surface-50 tabular-nums">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-[10px] font-bold text-surface-500 mt-1">
            {((payload[0].value / total) * 100).toFixed(1)}% of total
          </p>
        </div>
      )
    }
    return null
  }

  const renderLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 pt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
          <span className="text-[11px] font-medium text-surface-500">{entry.value}</span>
        </div>
      ))}
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
          animationBegin={0}
          animationDuration={1500}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </PieChart>
    </ResponsiveContainer>
  )
}
