"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface AnimatedRiskMeterProps {
  probability: number
}

export function AnimatedRiskMeter({ probability }: AnimatedRiskMeterProps) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(probability)
    }, 300)
    return () => clearTimeout(timer)
  }, [probability])

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (animatedValue / 100) * circumference

  const getColor = (prob: number) => {
    if (prob < 30) return "#22c55e" // green
    if (prob < 70) return "#f59e0b" // amber
    return "#ef4444" // red
  }

  const getRiskLevel = (prob: number) => {
    if (prob < 30) return { text: "Low Risk of Rejection", Icon: CheckCircle, color: "text-green-600" }
    if (prob < 70) return { text: "Medium Risk of Rejection", Icon: AlertTriangle, color: "text-amber-600" }
    return { text: "High Risk of Rejection", Icon: XCircle, color: "text-red-600" }
  }

  const riskLevel = getRiskLevel(probability)

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="none"
          />

          {/* Animated progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={getColor(probability)}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="text-center"
          >
            <motion.div
              className="text-4xl font-bold"
              style={{ color: getColor(probability) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {Math.round(animatedValue)}%
            </motion.div>
            <div className="text-sm text-gray-600 mt-1">Rejection Risk</div>
          </motion.div>
        </div>
      </div>

      {/* Risk level indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className={`flex items-center gap-2 text-lg font-semibold ${riskLevel.color}`}
      >
        <riskLevel.Icon className="h-6 w-6" />
        <span>{riskLevel.text}</span>
      </motion.div>
    </div>
  )
}
