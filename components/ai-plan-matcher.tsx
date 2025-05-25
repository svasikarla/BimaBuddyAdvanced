"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function AIPlanMatcher() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [autoAnimate, setAutoAnimate] = useState(false)
  
  // Auto-start animation after component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAutoAnimate(true)
      setIsAnimating(true)
    }, 1500)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Reset animation periodically for continuous effect
  useEffect(() => {
    if (!autoAnimate) return
    
    const interval = setInterval(() => {
      setIsAnimating(false)
      setTimeout(() => setIsAnimating(true), 300)
    }, 8000)
    
    return () => clearInterval(interval)
  }, [autoAnimate])
  
  return (
    <div className="relative h-[220px] rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 overflow-hidden shadow-lg border border-blue-100">
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-300 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-indigo-300 rounded-full blur-xl"></div>
      </div>
      
      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-lg font-bold mb-4 text-gray-800"
      >
        How Our AI Finds Your Perfect Plan
      </motion.h3>
      
      <div className="flex justify-between relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shadow-md">
            <motion.div
              animate={{ scale: isAnimating ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 1, repeat: isAnimating ? 1 : 0 }}
            >
              <span className="text-xl">👤</span>
            </motion.div>
          </div>
          <span className="text-sm mt-2 font-medium text-gray-700">Your Needs</span>
        </motion.div>
        
        <motion.div 
          className="absolute top-7 left-16 right-16 h-1.5 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: isAnimating ? 1 : 0, opacity: isAnimating ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <motion.div 
            className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg"
            animate={{ 
              scale: isAnimating ? [1, 1.2, 1] : 1,
              rotate: isAnimating ? [0, 180, 360] : 0,
              boxShadow: isAnimating ? 
                ["0px 0px 0px rgba(59, 130, 246, 0.5)", "0px 0px 20px rgba(59, 130, 246, 0.7)", "0px 0px 0px rgba(59, 130, 246, 0.5)"] : 
                "0px 0px 0px rgba(59, 130, 246, 0.5)"
            }}
            transition={{ duration: 3, repeat: isAnimating ? Infinity : 0, repeatDelay: 1 }}
          >
            <span className="text-xl font-bold">AI</span>
          </motion.div>
          <span className="text-sm mt-2 font-medium text-gray-700">Smart Matching</span>
        </motion.div>
        
        <motion.div 
          className="absolute top-7 right-16 left-[calc(50%+10px)] h-1.5 bg-gradient-to-r from-indigo-400 to-green-400 rounded-full"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: isAnimating ? 1 : 0, opacity: isAnimating ? 1 : 0 }}
          transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shadow-md">
            <motion.div
              animate={{ 
                scale: isAnimating ? [1, 1.2, 1] : 1,
                opacity: isAnimating ? [0.5, 1, 0.5] : 0.5
              }}
              transition={{ duration: 1, delay: 3, repeat: isAnimating ? 1 : 0 }}
            >
              <span className="text-xl">🛡️</span>
            </motion.div>
          </div>
          <span className="text-sm mt-2 font-medium text-gray-700">Perfect Plan</span>
        </motion.div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button 
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full shadow-md hover:bg-blue-700 transition-colors"
            onClick={() => {
              setIsAnimating(false)
              setTimeout(() => setIsAnimating(true), 300)
            }}
          >
            See How It Works
          </button>
        </motion.div>
      </div>
    </div>
  )
}