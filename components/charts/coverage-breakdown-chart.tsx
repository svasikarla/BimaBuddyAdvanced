"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Shield, Activity } from 'lucide-react'

interface CoverageData {
  name: string
  value: number
  color: string
}

interface CoverageBreakdownChartProps {
  data: CoverageData[]
  title?: string
  description?: string
  centerLabel?: string
  showPercentage?: boolean
}

const RADIAN = Math.PI / 180

export function CoverageBreakdownChart({
  data,
  title = "Coverage Breakdown",
  description = "Distribution of coverage across categories",
  centerLabel = "Total Coverage",
  showPercentage = true
}: CoverageBreakdownChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / total) * 100).toFixed(1)

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg"
        >
          <p className="font-semibold text-gray-900 mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: data.payload.color }}
              />
              <span className="text-gray-600">Amount:</span>
              <span className="font-semibold">₹{data.value.toLocaleString('en-IN')} L</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600">Coverage:</span>
              <span className="font-semibold">{percentage}%</span>
            </div>
          </div>
        </motion.div>
      )
    }
    return null
  }

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }: any) => {
    if (!showPercentage) return null

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  const renderCenterLabel = ({ cx, cy }: any) => {
    return (
      <g>
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm fill-gray-600"
        >
          {centerLabel}
        </text>
        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl font-bold fill-gray-900"
        >
          ₹{total.toLocaleString('en-IN')} L
        </text>
      </g>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                innerRadius={70}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                {renderCenterLabel}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry: any) => (
                  <span className="text-sm text-gray-700">
                    {value} (₹{entry.payload.value} L)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Coverage items list */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {data.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-600">
                  {((item.value / total) * 100).toFixed(1)}% of total
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
