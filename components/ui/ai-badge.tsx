"use client"

import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface AIBadgeProps {
  variant?: "primary" | "accent" | "subtle"
  size?: "sm" | "md" | "lg"
  animated?: boolean
  children?: React.ReactNode
}

export function AIBadge({
  variant = "primary",
  size = "md",
  animated = true,
  children
}: AIBadgeProps) {
  const variantStyles = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
    accent: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white",
    subtle: "bg-blue-50 text-blue-700 border border-blue-200"
  }

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  }

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  const Badge = animated ? motion.div : "div"

  return (
    <Badge
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${variantStyles[variant]} ${sizeStyles[size]}
        shadow-lg shadow-blue-500/20
      `}
      {...(animated && {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 }
      })}
    >
      <motion.div
        animate={{
          rotate: animated ? [0, 10, -10, 10, 0] : 0,
          scale: animated ? [1, 1.1, 1, 1.1, 1] : 1
        }}
        transition={{
          duration: 2,
          repeat: animated ? Infinity : 0,
          repeatDelay: 1
        }}
      >
        <Sparkles className={iconSize[size]} />
      </motion.div>
      {children || "AI-Powered"}
    </Badge>
  )
}
