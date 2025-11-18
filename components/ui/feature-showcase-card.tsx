"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

interface FeatureShowcaseCardProps {
  title: string
  description: string
  icon: LucideIcon
  iconGradient: string
  features: string[]
  badge?: {
    text: string
    variant: string
  }
  link: string
  linkText: string
  linkColor: string
  hoverBorderColor: string
  imageSrc?: string
  imageAlt?: string
}

export function FeatureShowcaseCard({
  title,
  description,
  icon: Icon,
  iconGradient,
  features,
  badge,
  link,
  linkText,
  linkColor,
  hoverBorderColor,
  imageSrc,
  imageAlt
}: FeatureShowcaseCardProps) {
  return (
    <Link href={link}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-${hoverBorderColor} group overflow-hidden`}>
          {/* Image Preview (if provided) */}
          {imageSrc && (
            <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
              <motion.img
                src={imageSrc}
                alt={imageAlt || title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
            </div>
          )}

          <CardHeader>
            <div className={`w-14 h-14 rounded-lg ${iconGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-xl flex items-center gap-2 flex-wrap">
              {title}
              {badge && (
                <Badge variant="outline" className={badge.variant}>
                  {badge.text}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>

          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
            <div className={`flex items-center ${linkColor} font-medium group-hover:gap-2 transition-all`}>
              {linkText}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  )
}
