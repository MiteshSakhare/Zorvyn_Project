import React, { useEffect, useRef, useState } from 'react'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { motion, useInView } from 'framer-motion'

const AnimatedNumber = ({ value, prefix = '' }) => {
  const [displayValue, setDisplayValue] = useState('0')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    // Parse the numeric value from formatted currency string
    const cleanValue = String(value).replace(prefix, '').replace(/[₹,\s]/g, '')
    const numericValue = parseFloat(cleanValue)
    if (isNaN(numericValue)) {
      setDisplayValue(value)
      return
    }

    const duration = 1200
    const startTime = performance.now()
    const startValue = 0

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (numericValue - startValue) * eased

      if (numericValue >= 1000) {
        setDisplayValue(new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0,
        }).format(Math.floor(current)))
      } else {
        setDisplayValue(new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(current))
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, prefix])

  return <span ref={ref}>{displayValue}</span>
}

export const StatCard = ({ icon: Icon, label, value, trend, color = 'blue', delay = 0 }) => {
  const colorMap = {
    blue: {
      bg: 'bg-primary-500/10',
      icon: 'text-primary-600 dark:text-primary-400',
      border: 'border-primary-500/20',
      shadow: 'shadow-primary-500/5',
      trend: 'text-primary-600 dark:text-primary-400',
      glow: 'group-hover:shadow-primary-500/10',
    },
    green: {
      bg: 'bg-accent-success/10',
      icon: 'text-accent-success',
      border: 'border-accent-success/20',
      shadow: 'shadow-accent-success/5',
      trend: 'text-accent-success',
      glow: 'group-hover:shadow-accent-success/10',
    },
    red: {
      bg: 'bg-accent-danger/10',
      icon: 'text-accent-danger',
      border: 'border-accent-danger/20',
      shadow: 'shadow-accent-danger/5',
      trend: 'text-accent-danger',
      glow: 'group-hover:shadow-accent-danger/10',
    },
    amber: {
      bg: 'bg-accent-warning/10',
      icon: 'text-accent-warning',
      border: 'border-accent-warning/20',
      shadow: 'shadow-accent-warning/5',
      trend: 'text-accent-warning',
      glow: 'group-hover:shadow-accent-warning/10',
    }
  }

  const theme = colorMap[color] || colorMap.blue

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className={`glass-card p-6 border ${theme.border} ${theme.shadow} relative overflow-hidden group cursor-default`}
    >
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-surface-200/50 dark:from-surface-700/20 to-transparent rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700"></div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-surface-500 text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50 mb-2.5 tabular-nums">
            <AnimatedNumber value={value} />
          </p>

          {trend && (
            <div className={`flex items-center gap-1 text-[11px] font-bold ${theme.trend}`}>
              {trend.startsWith('+') ? <ArrowOutwardIcon sx={{ fontSize: 14 }} /> : <ArrowDownwardIcon sx={{ fontSize: 14 }} />}
              <span>{trend} vs last month</span>
            </div>
          )}
        </div>

        <div className={`${theme.bg} p-3.5 rounded-xl border ${theme.border} shadow-inner`}>
          <Icon className={`${theme.icon}`} sx={{ fontSize: 24 }} />
        </div>
      </div>
    </motion.div>
  )
}
