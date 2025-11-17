"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

export function AnimatedCounter({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
  decimals = 0
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!isInView || hasAnimated) return

    setHasAnimated(true)
    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = startValue + (end - startValue) * easeOut

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration, hasAnimated])

  const formatNumber = (num: number) => {
    if (decimals === 0) {
      return Math.floor(num).toLocaleString()
    }
    return num.toFixed(decimals)
  }

  return (
    <div ref={ref} className="inline-block">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </div>
  )
}
