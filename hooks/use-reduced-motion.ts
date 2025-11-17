"use client"

import { useState, useEffect } from "react"

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if animations should be reduced/disabled
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Hook to get optimized animation variants based on user preferences
 */
export function useOptimizedAnimation() {
  const prefersReducedMotion = useReducedMotion()

  return {
    prefersReducedMotion,
    // Reduced motion variants
    fadeIn: prefersReducedMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : { initial: { opacity: 0 }, animate: { opacity: 1 } },

    fadeInUp: prefersReducedMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 }
        },

    scale: prefersReducedMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 }
        },

    // Transition durations - instant if reduced motion is preferred
    duration: prefersReducedMotion ? 0.01 : 0.3,

    // Spring config - less bouncy if reduced motion is preferred
    spring: prefersReducedMotion
      ? { type: "tween", duration: 0.01 }
      : { type: "spring", stiffness: 300, damping: 30 }
  }
}
