/**
 * API Utilities with retry logic, error handling, and caching
 */

export interface APIConfig {
  baseURL?: string
  timeout?: number
  maxRetries?: number
  retryDelay?: number
  cache?: boolean
  cacheTimeout?: number
}

export interface APIError {
  message: string
  code: string
  status?: number
  details?: any
}

export interface APIResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Headers
}

const DEFAULT_CONFIG: Required<APIConfig> = {
  baseURL: '',
  timeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
  cache: true,
  cacheTimeout: 5 * 60 * 1000 // 5 minutes
}

// Simple in-memory cache
class APICache {
  private cache = new Map<string, { data: any; timestamp: number }>()

  set(key: string, data: any, timeout: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + timeout
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    // Check if expired
    if (Date.now() > item.timestamp) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    // Clear matching keys
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  invalidate(key: string): void {
    this.cache.delete(key)
  }
}

const cache = new APICache()

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate cache key from URL and options
 */
function getCacheKey(url: string, options?: RequestInit): string {
  const method = options?.method || 'GET'
  const body = options?.body ? JSON.stringify(options.body) : ''
  return `${method}:${url}:${body}`
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: any): boolean {
  // Retry on network errors
  if (error.name === 'TypeError' || error.message === 'Failed to fetch') {
    return true
  }

  // Retry on specific HTTP status codes
  const retryableStatuses = [408, 429, 500, 502, 503, 504]
  return error.status && retryableStatuses.includes(error.status)
}

/**
 * Create custom error object
 */
function createAPIError(error: any, status?: number): APIError {
  return {
    message: error.message || 'An error occurred',
    code: error.code || 'UNKNOWN_ERROR',
    status: status || error.status,
    details: error.details || error
  }
}

/**
 * Main API request function with retry logic
 */
export async function apiRequest<T = any>(
  url: string,
  options: RequestInit & APIConfig = {}
): Promise<APIResponse<T>> {
  const config = { ...DEFAULT_CONFIG, ...options }
  const cacheKey = getCacheKey(url, options)

  // Check cache for GET requests
  if (config.cache && options.method === 'GET') {
    const cached = cache.get(cacheKey)
    if (cached) {
      return cached
    }
  }

  let lastError: any
  let attempt = 0

  while (attempt <= config.maxRetries) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.timeout)

      const response = await fetch(`${config.baseURL}${url}`, {
        ...options,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw {
          message: errorData.message || response.statusText,
          status: response.status,
          details: errorData
        }
      }

      // Parse response
      const data = await response.json()

      const result: APIResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      }

      // Cache successful GET requests
      if (config.cache && options.method === 'GET') {
        cache.set(cacheKey, result, config.cacheTimeout)
      }

      return result

    } catch (error: any) {
      lastError = error

      // Check if we should retry
      if (attempt < config.maxRetries && isRetryableError(error)) {
        attempt++
        const delay = config.retryDelay * Math.pow(2, attempt - 1) // Exponential backoff
        await sleep(delay)
        continue
      }

      // Max retries reached or non-retryable error
      throw createAPIError(error)
    }
  }

  throw createAPIError(lastError)
}

/**
 * Convenience methods for different HTTP verbs
 */
export const api = {
  get: <T = any>(url: string, config?: APIConfig) =>
    apiRequest<T>(url, { ...config, method: 'GET' }),

  post: <T = any>(url: string, data?: any, config?: APIConfig) =>
    apiRequest<T>(url, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      body: JSON.stringify(data)
    }),

  put: <T = any>(url: string, data?: any, config?: APIConfig) =>
    apiRequest<T>(url, {
      ...config,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      body: JSON.stringify(data)
    }),

  delete: <T = any>(url: string, config?: APIConfig) =>
    apiRequest<T>(url, { ...config, method: 'DELETE' }),

  patch: <T = any>(url: string, data?: any, config?: APIConfig) =>
    apiRequest<T>(url, {
      ...config,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      body: JSON.stringify(data)
    })
}

/**
 * Cache utilities
 */
export const cacheUtils = {
  clear: (pattern?: string) => cache.clear(pattern),
  invalidate: (key: string) => cache.invalidate(key),
  clearAll: () => cache.clear()
}

/**
 * Request interceptor
 */
export type RequestInterceptor = (
  url: string,
  options: RequestInit
) => { url: string; options: RequestInit } | Promise<{ url: string; options: RequestInit }>

/**
 * Response interceptor
 */
export type ResponseInterceptor = <T>(response: APIResponse<T>) => APIResponse<T> | Promise<APIResponse<T>>

/**
 * Error interceptor
 */
export type ErrorInterceptor = (error: APIError) => APIError | Promise<APIError>

const interceptors = {
  request: [] as RequestInterceptor[],
  response: [] as ResponseInterceptor[],
  error: [] as ErrorInterceptor[]
}

export const apiInterceptors = {
  addRequest: (interceptor: RequestInterceptor) => {
    interceptors.request.push(interceptor)
  },

  addResponse: (interceptor: ResponseInterceptor) => {
    interceptors.response.push(interceptor)
  },

  addError: (interceptor: ErrorInterceptor) => {
    interceptors.error.push(interceptor)
  },

  clearAll: () => {
    interceptors.request = []
    interceptors.response = []
    interceptors.error = []
  }
}
