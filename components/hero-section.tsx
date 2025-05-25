"use client"

import { useLanguage } from "./language-provider"
import { GlassCard } from "./ui/glass-card"
import { AIPlanMatcher } from "./ai-plan-matcher"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export function HeroSection() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [animateHero, setAnimateHero] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  
  useEffect(() => {
    // Start visibility animation on component mount
    setIsVisible(true)
    
    // Start hero animation after a short delay
    const timer = setTimeout(() => {
      setAnimateHero(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="w-full py-8 md:py-16 lg:py-20 bg-gradient-to-b from-blue-50 via-white to-gray-50 overflow-hidden relative">
      {/* Enhanced decorative elements with animation */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
        className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"
      />
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="space-y-5">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600/10 text-blue-600 text-sm font-medium mb-2"
              >
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                AI-Powered Insurance Guidance
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gray-900"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  {t("hero.title")}
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="max-w-[600px] text-gray-700 text-lg md:text-xl/relaxed lg:text-xl/relaxed leading-relaxed"
              >
                {t("hero.subtitle")}
              </motion.p>
              
              {/* Red Flags All Policies button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8 }}
                className="flex flex-wrap gap-4 mt-2"
              >
                <Link href="/find-best-plan">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 group"
                  >
                    Find Your Best Plan
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </motion.button>
                </Link>
                
                <Link href="/all-policies">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium rounded-lg shadow-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 group"
                  >
                    <svg className="w-5 h-5 mr-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Red Flags - All Policies
                  </motion.button>
                </Link>
              </motion.div>
            </div>
            
            {/* Enhanced trust indicators with animation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-wrap items-center gap-5 text-sm text-gray-700 mt-2"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm"
              >
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">IRDAI Approved</span>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm"
              >
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">10,000+ Customers</span>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm"
              >
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">95% Claim Settlement</span>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="mx-auto lg:ml-auto flex flex-col gap-6"
          >
            {/* Hero image with animation */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative rounded-xl overflow-hidden shadow-2xl max-w-full"
            >
              <img
                alt="Health Insurance"
                className="w-full object-contain"
                src="/HealthInsurance-hero2.jpg"
                style={{ maxHeight: "400px", width: "100%" }}
              />
              
              {/* Text overlay removed as requested */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent">
                {/* Text content removed */}
              </div>
            </motion.div>
            
            {/* Enhanced AI Plan Matcher visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <AIPlanMatcher />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
