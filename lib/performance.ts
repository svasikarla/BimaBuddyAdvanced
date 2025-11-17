/**
 * Performance monitoring utilities
 * Tracks Web Vitals and custom performance metrics
 */

// Web Vitals metrics
export interface WebVitals {
  CLS: number // Cumulative Layout Shift
  FID: number // First Input Delay
  FCP: number // First Contentful Paint
  LCP: number // Largest Contentful Paint
  TTFB: number // Time to First Byte
}

/**
 * Report Web Vitals to console in development
 * Can be extended to send to analytics in production
 */
export function reportWebVitals(metric: {
  name: string
  value: number
  id: string
  rating: 'good' | 'needs-improvement' | 'poor'
}) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id
    })
  }

  // In production, send to your analytics service
  // Example: analytics.track('web-vital', metric)
}

/**
 * Measure component render time
 */
export function measureRender(
  componentName: string,
  callback: () => void
): void {
  const start = performance.now()
  callback()
  const end = performance.now()
  const duration = end - start

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Render Time] ${componentName}: ${duration.toFixed(2)}ms`)
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Check if device is low-end based on hardware concurrency and memory
 */
export function isLowEndDevice(): boolean {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 1

  // Check device memory (in GB) if available
  const memory = (navigator as any).deviceMemory || 4

  // Consider low-end if < 4 cores or < 4GB RAM
  return cores < 4 || memory < 4
}

/**
 * Get recommended animation quality based on device capability
 */
export function getAnimationQuality(): 'high' | 'medium' | 'low' {
  if (typeof window === 'undefined') return 'high'

  const isLowEnd = isLowEndDevice()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) return 'low'
  if (isLowEnd) return 'medium'
  return 'high'
}

/**
 * Lazy load a module with error handling
 */
export async function lazyLoadModule<T>(
  importFn: () => Promise<T>
): Promise<T | null> {
  try {
    return await importFn()
  } catch (error) {
    console.error('[Lazy Load] Failed to load module:', error)
    return null
  }
}

/**
 * Request Idle Callback polyfill for older browsers
 */
export const requestIdleCallback =
  typeof window !== 'undefined'
    ? (window.requestIdleCallback ||
        function (cb: IdleRequestCallback) {
          const start = Date.now()
          return setTimeout(function () {
            cb({
              didTimeout: false,
              timeRemaining: function () {
                return Math.max(0, 50 - (Date.now() - start))
              }
            })
          }, 1)
        })
    : (cb: IdleRequestCallback) => setTimeout(cb, 1)

/**
 * Cancel Idle Callback polyfill
 */
export const cancelIdleCallback =
  typeof window !== 'undefined'
    ? (window.cancelIdleCallback || clearTimeout)
    : clearTimeout

/**
 * Execute function during browser idle time
 */
export function runWhenIdle(callback: () => void): void {
  requestIdleCallback(() => {
    callback()
  })
}
