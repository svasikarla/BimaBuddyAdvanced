"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, TrendingUp, Shield, Star } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface EnhancedPolicyCardProps {
  title: string
  description: string
  premium: string
  coverage: string
  rating?: number
  features?: string[]
  recommended?: boolean
  onCompare?: () => void
  onViewDetails?: () => void
  className?: string
}

export function EnhancedPolicyCard({
  title,
  description,
  premium,
  coverage,
  rating = 0,
  features = [],
  recommended = false,
  onCompare,
  onViewDetails,
  className = ""
}: EnhancedPolicyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites", {
      duration: 2000
    })
  }

  const handleShare = () => {
    toast.success("Link copied to clipboard!", {
      duration: 2000
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
    >
      <Card className={`relative overflow-hidden transition-shadow duration-300 ${
        isHovered ? 'shadow-xl' : 'shadow-md'
      } ${recommended ? 'border-2 border-blue-500' : ''}`}>
        {/* Recommended badge with animation */}
        {recommended && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="absolute top-4 -left-2 z-10"
          >
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-r-full shadow-lg flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Recommended
            </Badge>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavorite}
            className={`p-2 rounded-full bg-white shadow-md transition-colors ${
              isFavorite ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="p-2 rounded-full bg-white shadow-md text-gray-600"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>

        <CardHeader className="pt-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold mb-2">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>

          {/* Rating */}
          {rating > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1 mt-2"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Premium and coverage cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
            >
              <p className="text-xs text-gray-600 mb-1">Premium</p>
              <p className="text-lg font-bold text-blue-900">{premium}</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200"
            >
              <p className="text-xs text-gray-600 mb-1">Coverage</p>
              <p className="text-lg font-bold text-green-900">{coverage}</p>
            </motion.div>
          </div>

          {/* Features list with stagger animation */}
          {features.length > 0 && (
            <motion.div
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="space-y-2"
            >
              {features.slice(0, 3).map((feature, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex gap-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button
              onClick={onViewDetails}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              View Details
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onCompare}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Compare
            </Button>
          </motion.div>
        </CardFooter>

        {/* Hover effect overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.05 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 pointer-events-none"
        />
      </Card>
    </motion.div>
  )
}
