"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface PolicyPremiumData {
  name: string
  premium: number
  coverage: number
  recommended?: boolean
}

interface PremiumComparisonChartProps {
  data: PolicyPremiumData[]
  title?: string
  description?: string
  showCoverage?: boolean
}

export function PremiumComparisonChart({
  data,
  title = "Premium Comparison",
  description = "Compare premiums across different policies",
  showCoverage = true
}: PremiumComparisonChartProps) {
  const colors = {
    premium: '#3b82f6',
    coverage: '#10b981',
    recommended: '#8b5cf6'
  }

  // Calculate statistics
  const avgPremium = data.reduce((acc, d) => acc + d.premium, 0) / data.length
  const minPremium = Math.min(...data.map(d => d.premium))
  const maxPremium = Math.max(...data.map(d => d.premium))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg"
        >
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold">
                ₹{entry.value.toLocaleString('en-IN')}
                {entry.name === 'Coverage' && ' L'}
              </span>
            </div>
          ))}
        </motion.div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 rounded-lg p-3"
          >
            <p className="text-xs text-gray-600 mb-1">Average Premium</p>
            <p className="text-lg font-bold text-blue-900">
              ₹{avgPremium.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-green-50 rounded-lg p-3"
          >
            <p className="text-xs text-gray-600 mb-1">Lowest Premium</p>
            <p className="text-lg font-bold text-green-900">
              ₹{minPremium.toLocaleString('en-IN')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-purple-50 rounded-lg p-3"
          >
            <p className="text-xs text-gray-600 mb-1">Highest Premium</p>
            <p className="text-lg font-bold text-purple-900">
              ₹{maxPremium.toLocaleString('en-IN')}
            </p>
          </motion.div>
        </div>
      </CardHeader>

      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{ value: 'Amount (₹)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar
                dataKey="premium"
                name="Premium"
                fill={colors.premium}
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.recommended ? colors.recommended : colors.premium}
                  />
                ))}
              </Bar>
              {showCoverage && (
                <Bar
                  dataKey="coverage"
                  name="Coverage"
                  fill={colors.coverage}
                  radius={[8, 8, 0, 0]}
                  animationDuration={1000}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Legend for recommended */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600" />
            <span>Standard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-600" />
            <span>Recommended</span>
          </div>
          {showCoverage && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-600" />
              <span>Coverage (in Lakhs)</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
