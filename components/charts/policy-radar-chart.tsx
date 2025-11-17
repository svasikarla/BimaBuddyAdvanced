"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Target, Award } from 'lucide-react'

interface RadarDataPoint {
  category: string
  policy1: number
  policy2?: number
  policy3?: number
  fullMark: number
}

interface PolicyRadarChartProps {
  data: RadarDataPoint[]
  policy1Name: string
  policy2Name?: string
  policy3Name?: string
  title?: string
  description?: string
}

export function PolicyRadarChart({
  data,
  policy1Name,
  policy2Name,
  policy3Name,
  title = "Policy Feature Comparison",
  description = "Compare key features across policies"
}: PolicyRadarChartProps) {
  const colors = {
    policy1: '#3b82f6',
    policy2: '#10b981',
    policy3: '#f59e0b'
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg"
        >
          <p className="font-semibold text-gray-900 mb-2">
            {payload[0].payload.category}
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold">
                {entry.value}/{entry.payload.fullMark}
              </span>
              <span className="text-xs text-gray-500">
                ({((entry.value / entry.payload.fullMark) * 100).toFixed(0)}%)
              </span>
            </div>
          ))}
        </motion.div>
      )
    }
    return null
  }

  // Calculate average scores
  const policy1Avg = data.reduce((acc, d) => acc + (d.policy1 / d.fullMark) * 100, 0) / data.length
  const policy2Avg = policy2Name
    ? data.reduce((acc, d) => acc + ((d.policy2 || 0) / d.fullMark) * 100, 0) / data.length
    : 0
  const policy3Avg = policy3Name
    ? data.reduce((acc, d) => acc + ((d.policy3 || 0) / d.fullMark) * 100, 0) / data.length
    : 0

  const topPolicy =
    policy1Avg >= policy2Avg && policy1Avg >= policy3Avg
      ? { name: policy1Name, score: policy1Avg, color: colors.policy1 }
      : policy2Avg >= policy3Avg
      ? { name: policy2Name, score: policy2Avg, color: colors.policy2 }
      : { name: policy3Name, score: policy3Avg, color: colors.policy3 }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>

        {/* Top performer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200"
        >
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-600" />
            <div>
              <p className="text-xs text-gray-600 mb-0.5">Top Performer</p>
              <p className="text-lg font-bold" style={{ color: topPolicy.color }}>
                {topPolicy.name}
              </p>
              <p className="text-sm text-gray-600">
                Overall Score: {topPolicy.score.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      </CardHeader>

      <CardContent>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart data={data}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 'dataMax']}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Radar
                name={policy1Name}
                dataKey="policy1"
                stroke={colors.policy1}
                fill={colors.policy1}
                fillOpacity={0.3}
                strokeWidth={2}
                animationDuration={1000}
              />
              {policy2Name && (
                <Radar
                  name={policy2Name}
                  dataKey="policy2"
                  stroke={colors.policy2}
                  fill={colors.policy2}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  animationDuration={1000}
                  animationBegin={200}
                />
              )}
              {policy3Name && (
                <Radar
                  name={policy3Name}
                  dataKey="policy3"
                  stroke={colors.policy3}
                  fill={colors.policy3}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  animationDuration={1000}
                  animationBegin={400}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Score breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {policy1Name}
            </p>
            <p className="text-2xl font-bold text-blue-900">
              {policy1Avg.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Average Score</p>
          </motion.div>

          {policy2Name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {policy2Name}
              </p>
              <p className="text-2xl font-bold text-green-900">
                {policy2Avg.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">Average Score</p>
            </motion.div>
          )}

          {policy3Name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-4 bg-amber-50 rounded-lg border border-amber-200"
            >
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {policy3Name}
              </p>
              <p className="text-2xl font-bold text-amber-900">
                {policy3Avg.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">Average Score</p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
