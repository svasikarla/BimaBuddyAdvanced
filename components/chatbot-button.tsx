"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, Sparkles } from "lucide-react"
import { useLanguage } from "./language-provider"
import { Chatbot } from "./chatbot"
import { motion, AnimatePresence } from "framer-motion"

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <>
      {/* Enhanced Floating Button with AI Branding */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-75"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Main button */}
        <div className="relative h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl">
          <MessageCircle className="h-8 w-8 text-white" />

          {/* AI sparkle indicator */}
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-yellow-900" />
            </div>
          </motion.div>
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none"
        >
          Ask our AI Assistant
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900" />
        </motion.div>

        <span className="sr-only">{t("chat.start")}</span>
      </motion.button>

      {/* Enhanced Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-20"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white rounded-lg shadow-2xl flex flex-col w-full max-w-2xl h-[600px] mx-auto overflow-hidden"
            >
              {/* AI Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">BimaBuddy AI Assistant</h3>
                      <p className="text-sm text-blue-100">Powered by GPT-4 & ElevenLabs</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
              </div>
              <Chatbot />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

