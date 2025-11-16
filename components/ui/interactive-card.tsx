"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./card"

interface InteractiveCardProps {
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  variant?: "default" | "elevated" | "featured" | "ai"
  hover?: boolean
  onClick?: () => void
  className?: string
}

export function InteractiveCard({
  title,
  description,
  children,
  footer,
  variant = "default",
  hover = true,
  onClick,
  className = ""
}: InteractiveCardProps) {

  const variants = {
    default: "border-gray-200 bg-white",
    elevated: "border-gray-200 bg-white shadow-lg",
    featured: "border-blue-200 bg-gradient-to-br from-blue-50 to-white ring-2 ring-blue-100",
    ai: "border-purple-200 bg-gradient-to-br from-purple-50 via-blue-50 to-white ring-2 ring-purple-100"
  }

  const hoverVariant = hover ? {
    whileHover: {
      y: -4,
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      transition: { duration: 0.2 }
    },
    whileTap: onClick ? { scale: 0.98 } : {}
  } : {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      {...hoverVariant}
      onClick={onClick}
      className={onClick ? "cursor-pointer" : ""}
    >
      <Card className={`${variants[variant]} transition-all duration-200 ${className}`}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          {children}
        </CardContent>
        {footer && (
          <CardFooter>
            {footer}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}
