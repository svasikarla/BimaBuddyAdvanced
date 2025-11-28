"use client"

import { useLanguage } from "./language-provider"
import { AIBadge } from "./ui/ai-badge"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
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
      {/* Subtle decorative elements - Optimized for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Two Column Layout - Improved spacing for mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  <span>India's First AI-Powered Health Insurance Platform</span>
                </div>
              </motion.div>

              {/* Main Headline - Optimized typography */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4 md:space-y-6"
              >
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl leading-tight">
                  <span className="block text-gray-900 mb-2">Find Your Perfect</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-gradient">
                    Health Insurance Plan
                  </span>
                </h1>

                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Compare 50+ plans, predict claim approvals, earn wellness rewards, and get AI-powered
                  recommendations in your native language. All in one platform.
                </p>
              </motion.div>

              {/* CTA Buttons - Improved mobile UX */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 md:gap-4"
              >
                <Link href="/find-best-plan" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105 group">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/compare-plans" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold hover:bg-gray-50 transition-all">
                    Compare Plans
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-6 md:gap-8 pt-4"
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

            {/* Mobile Hero Image - Shown on small screens */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative lg:hidden mt-8 mb-4"
            >
              <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px]">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="/HealthInsurance-hero2.jpg"
                    alt="Health Insurance Platform - Family Protection"
                    fill
                    className="object-cover"
                    priority
                    quality={80}
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB//2Q=="
                  />
                  {/* Gradient overlay for mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent" />
                </div>
              </div>
            </motion.div>

            {/* Desktop Hero Image - Hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[500px] xl:h-[600px]">
                {/* Decorative gradient background with improved styling */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-3xl transform rotate-3 blur-sm opacity-60" />

                {/* Image Container with improved performance */}
                <div className="relative w-full h-full transform -rotate-1 hover:rotate-0 transition-transform duration-500 group">
                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src="/HealthInsurance-hero2.jpg"
                      alt="Health Insurance Platform - Family Protection and Coverage"
                      fill
                      className="object-cover"
                      priority
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB//2Q=="
                    />
                    {/* Subtle gradient overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/5 via-transparent to-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>

                {/* Floating badge overlay - Improved with backdrop blur */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">95%</div>
                      <div className="text-sm text-gray-600 font-medium">Claim Settlement</div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating badge overlay 2 - Improved with backdrop blur */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
                      <div className="text-sm text-gray-600 font-medium">Happy Customers</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

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
