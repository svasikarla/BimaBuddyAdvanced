"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { TrendingUp, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface TrendData {
  age: number
  premium: number
  avgMarket?: number
}

interface PremiumTrendChartProps {
  data: TrendData[]
  policyName?: string
  title?: string
  description?: string
  showMarketAverage?: boolean
}

export function PremiumTrendChart({
  data,
  policyName = "Selected Policy",
  title = "Premium Trends by Age",
  description = "How premiums increase with age",
  showMarketAverage = true
}: PremiumTrendChartProps) {
  const [chartType, setChartType] = useState<'line' | 'area'>('area')

  // Calculate growth rate
  const firstPremium = data[0]?.premium || 0
  const lastPremium = data[data.length - 1]?.premium || 0
  const growthRate = firstPremium > 0
    ? (((lastPremium - firstPremium) / firstPremium) * 100).toFixed(1)
    : 0

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg"
        >
          <p className="font-semibold text-gray-900 mb-2">Age: {label} years</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold">
                ₹{entry.value.toLocaleString('en-IN')}/year
              </span>
            </div>
          ))}
          {payload.length > 1 && payload[0].value < payload[1].value && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Above market average
              </p>
            </div>
          )}
        </motion.div>
      )
    }
    return null
  }

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props

    // Highlight specific age milestones
    const isMilestone = payload.age % 10 === 0

    if (!isMilestone) return null

    return (
      <motion.circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#3b82f6"
        stroke="#fff"
        strokeWidth={2}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: payload.age / 100 }}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          {/* Chart type toggle */}
          <div className="flex gap-2">
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              Area
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              Line
            </Button>
          </div>
        </div>

        {/* Growth statistics */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-blue-50 rounded-lg p-3"
          >
            <p className="text-xs text-gray-600 mb-1">Starting Premium</p>
            <p className="text-lg font-bold text-blue-900">
              ₹{firstPremium.toLocaleString('en-IN')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-purple-50 rounded-lg p-3"
          >
            <p className="text-xs text-gray-600 mb-1">Final Premium</p>
            <p className="text-lg font-bold text-purple-900">
              ₹{lastPremium.toLocaleString('en-IN')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-lg p-3 ${
              Number(growthRate) > 100
                ? 'bg-red-50'
                : Number(growthRate) > 50
                ? 'bg-yellow-50'
                : 'bg-green-50'
            }`}
          >
            <p className="text-xs text-gray-600 mb-1">Growth Rate</p>
            <p className={`text-lg font-bold ${
              Number(growthRate) > 100
                ? 'text-red-900'
                : Number(growthRate) > 50
                ? 'text-yellow-900'
                : 'text-green-900'
            }`}>
              +{growthRate}%
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
            {chartType === 'area' ? (
              <AreaChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="age"
                  label={{ value: 'Age (years)', position: 'insideBottom', offset: -10 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Premium (₹/year)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="premium"
                  name={policyName}
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#colorPremium)"
                  animationDuration={1500}
                  dot={<CustomDot />}
                />
                {showMarketAverage && (
                  <Area
                    type="monotone"
                    dataKey="avgMarket"
                    name="Market Average"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="url(#colorMarket)"
                    animationDuration={1500}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="age"
                  label={{ value: 'Age (years)', position: 'insideBottom', offset: -10 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Premium (₹/year)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="premium"
                  name={policyName}
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={<CustomDot />}
                  animationDuration={1500}
                />
                {showMarketAverage && (
                  <Line
                    type="monotone"
                    dataKey="avgMarket"
                    name="Market Average"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    animationDuration={1500}
                  />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </motion.div>

        {/* Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Insight</p>
              <p className="text-sm text-blue-800">
                Premiums increase by approximately {growthRate}% from age {data[0]?.age} to{' '}
                {data[data.length - 1]?.age}. Consider purchasing early to lock in lower rates.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
