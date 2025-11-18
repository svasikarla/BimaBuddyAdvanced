"use client"

import { motion } from "framer-motion"

interface DecorativeBlobProps {
  color?: string
  size?: "sm" | "md" | "lg" | "xl"
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center"
  animated?: boolean
  opacity?: number
}

const sizeMap = {
  sm: "w-32 h-32",
  md: "w-64 h-64",
  lg: "w-96 h-96",
  xl: "w-[32rem] h-[32rem]"
}

const positionMap = {
  "top-left": "-top-16 -left-16",
  "top-right": "-top-16 -right-16",
  "bottom-left": "-bottom-16 -left-16",
  "bottom-right": "-bottom-16 -right-16",
  "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
}

export function DecorativeBlob({
  color = "blue",
  size = "lg",
  position = "top-right",
  animated = true,
  opacity = 0.1
}: DecorativeBlobProps) {
  const colorClass = `bg-${color}-400`

  if (animated) {
    return (
      <motion.div
        className={`absolute ${positionMap[position]} ${sizeMap[size]} rounded-full blur-3xl pointer-events-none`}
        style={{
          backgroundColor: `var(--${color})`,
          opacity: opacity
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1, 0.9, 1],
          opacity: [0, opacity, opacity * 0.8, opacity],
          x: [0, 20, -10, 0],
          y: [0, -15, 10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    )
  }

  return (
    <div
      className={`absolute ${positionMap[position]} ${sizeMap[size]} ${colorClass} rounded-full blur-3xl pointer-events-none`}
      style={{ opacity }}
    />
  )
}
