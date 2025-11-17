"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Minus, ChevronDown, ChevronUp } from "lucide-react"

interface ComparisonFeature {
  name: string
  policy1: boolean | string
  policy2: boolean | string
  category: string
}

interface AnimatedComparisonProps {
  policy1Name: string
  policy2Name: string
  features: ComparisonFeature[]
}

export function AnimatedComparison({
  policy1Name,
  policy2Name,
  features
}: AnimatedComparisonProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [highlightDifferences, setHighlightDifferences] = useState(false)

  const categories = Array.from(new Set(features.map(f => f.category)))

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const renderValue = (value: boolean | string, isDifferent: boolean) => {
    if (typeof value === 'boolean') {
      return (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`inline-flex items-center justify-center p-2 rounded-full ${
            value
              ? isDifferent && highlightDifferences
                ? 'bg-green-100 text-green-700'
                : 'bg-green-50 text-green-600'
              : isDifferent && highlightDifferences
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {value ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </motion.div>
      )
    }

    return (
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`text-sm font-medium ${
          isDifferent && highlightDifferences
            ? 'bg-yellow-100 text-yellow-900 px-2 py-1 rounded'
            : 'text-gray-700'
        }`}
      >
        {value}
      </motion.span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-900">Feature Comparison</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            onClick={() => setHighlightDifferences(!highlightDifferences)}
            variant={highlightDifferences ? "default" : "outline"}
            size="sm"
          >
            {highlightDifferences ? 'Show All' : 'Highlight Differences'}
          </Button>
        </motion.div>
      </div>

      {/* Comparison table */}
      <Card className="overflow-hidden">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4"
        >
          <div className="font-semibold">Feature</div>
          <div className="font-semibold text-center">{policy1Name}</div>
          <div className="font-semibold text-center">{policy2Name}</div>
        </motion.div>

        {/* Categories and features */}
        <div>
          {categories.map((category, categoryIndex) => {
            const categoryFeatures = features.filter(f => f.category === category)
            const isExpanded = expandedCategories.has(category)

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                {/* Category header */}
                <motion.button
                  onClick={() => toggleCategory(category)}
                  whileHover={{ backgroundColor: '#f9fafb' }}
                  className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{category}</span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  </motion.div>
                </motion.button>

                {/* Category features */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {categoryFeatures.map((feature, index) => {
                        const isDifferent = feature.policy1 !== feature.policy2

                        return (
                          <motion.div
                            key={feature.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`grid grid-cols-3 p-4 border-b items-center ${
                              isDifferent && highlightDifferences
                                ? 'bg-yellow-50'
                                : 'bg-white hover:bg-gray-50'
                            }`}
                          >
                            <div className="text-sm text-gray-700 font-medium">
                              {feature.name}
                              {isDifferent && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-2 text-xs text-yellow-600"
                                >
                                  •
                                </motion.span>
                              )}
                            </div>
                            <div className="flex justify-center">
                              {renderValue(feature.policy1, isDifferent)}
                            </div>
                            <div className="flex justify-center">
                              {renderValue(feature.policy2, isDifferent)}
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* Legend */}
      {highlightDifferences && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 text-sm text-gray-600"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded" />
            <span>Different values</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
            <span>Better coverage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
            <span>Not covered</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
