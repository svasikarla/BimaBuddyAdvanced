"use client"

import { useLanguage } from "./language-provider"
import { AIBadge } from "./ui/ai-badge"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Brain,
  Mic,
  Activity
} from "lucide-react"

export function HeroSection() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    { icon: Shield, text: "IRDAI Approved", color: "text-green-600" },
    { icon: Users, text: "10,000+ Customers", color: "text-blue-600" },
    { icon: CheckCircle2, text: "95% Claim Settlement", color: "text-purple-600" }
  ]

  return (
    <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden relative">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg">
                <Sparkles className="w-4 h-4" />
                <span>India's First AI-Powered Health Insurance Platform</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-gray-900">Find Your Perfect</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                  Health Insurance Plan
                </span>
              </h1>

              <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
                Compare 50+ plans, predict claim approvals, earn wellness rewards, and get AI-powered
                recommendations in your native language. All in one platform.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/find-best-plan">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/compare-plans">
                <Button size="lg" variant="outline" className="border-2 px-8 py-6 text-lg font-semibold hover:bg-gray-50">
                  Compare Plans
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 md:gap-8 pt-8"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-center gap-2 text-sm md:text-base">
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                    <span className="font-medium text-gray-700">{feature.text}</span>
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Feature Highlights - Visual Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-20"
          >
            {[
              {
                icon: Brain,
                title: "AI Claim Intelligence",
                description: "85% prediction accuracy",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Mic,
                title: "Voice Assistant",
                description: "10 Indian languages",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Activity,
                title: "Wellness Rewards",
                description: "Up to 12% discount",
                gradient: "from-green-500 to-emerald-500"
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                  whileHover={{ y: -5 }}
                  className="relative group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
