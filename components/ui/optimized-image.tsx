"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  onLoad?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  onLoad
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (priority) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "50px" // Start loading 50px before the image is in view
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Skeleton loader */}
      {!isLoaded && (
        <Skeleton
          className="absolute inset-0"
          style={{ width: "100%", height: "100%" }}
        />
      )}

      {/* Image with fade-in animation */}
      {isInView && (
        <motion.img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onLoad={handleLoad}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  )
}

/**
 * Preload critical images for better performance
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(src => preloadImage(src)))
}
