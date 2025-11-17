"use client"

import { motion } from "framer-motion"
import { Home, Search, FileText, Calculator, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/find-best-plan", icon: Search, label: "Find Plan" },
  { href: "/compare-plans", icon: FileText, label: "Compare" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/claim-rejection-predictor", icon: Calculator, label: "Predictor" },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50 shadow-lg"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href ||
                          (item.href !== "/" && pathname.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center tap-target no-select"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative flex flex-col items-center"
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Icon with animation */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className={`mb-1 ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Label */}
                <motion.span
                  animate={{
                    color: isActive ? 'rgb(37 99 235)' : 'rgb(107 114 128)',
                    fontWeight: isActive ? 600 : 400
                  }}
                  className="text-xs"
                >
                  {item.label}
                </motion.span>
              </motion.div>

              {/* Ripple effect on tap */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-blue-600 rounded-full"
                />
              )}
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
