/**
 * Comprehensive error handling utilities
 */

import { toast } from 'sonner'
import type { APIError } from './api'

export enum ErrorType {
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

export interface ErrorDetails {
  type: ErrorType
  message: string
  code?: string
  status?: number
  details?: any
  timestamp: number
}

/**
 * Determine error type from status code or error object
 */
export function getErrorType(error: APIError | Error | any): ErrorType {
  // Check for specific error types
  if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
    return ErrorType.NETWORK
  }

  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return ErrorType.TIMEOUT
  }

  // Check status codes
  if (error.status) {
    const status = error.status

    if (status === 401) return ErrorType.AUTHENTICATION
    if (status === 403) return ErrorType.AUTHORIZATION
    if (status === 404) return ErrorType.NOT_FOUND
    if (status === 422) return ErrorType.VALIDATION
    if (status >= 500) return ErrorType.SERVER
  }

  return ErrorType.UNKNOWN
}

/**
 * Create standardized error details
 */
export function createErrorDetails(error: any): ErrorDetails {
  return {
    type: getErrorType(error),
    message: error.message || 'An unexpected error occurred',
    code: error.code,
    status: error.status,
    details: error.details || error,
    timestamp: Date.now()
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(errorType: ErrorType): string {
  const messages: Record<ErrorType, string> = {
    [ErrorType.NETWORK]: 'Network error. Please check your internet connection and try again.',
    [ErrorType.VALIDATION]: 'Please check your input and try again.',
    [ErrorType.AUTHENTICATION]: 'Please log in to continue.',
    [ErrorType.AUTHORIZATION]: 'You don\'t have permission to access this resource.',
    [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
    [ErrorType.SERVER]: 'Server error. Please try again later.',
    [ErrorType.TIMEOUT]: 'Request timed out. Please try again.',
    [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.'
  }

  return messages[errorType] || messages[ErrorType.UNKNOWN]
}

/**
 * Show error toast with appropriate styling
 */
export function showErrorToast(error: any, customMessage?: string): void {
  const errorDetails = createErrorDetails(error)
  const message = customMessage || getUserFriendlyMessage(errorDetails.type)

  toast.error(message, {
    description: errorDetails.message !== message ? errorDetails.message : undefined,
    duration: 5000
  })
}

/**
 * Log error for debugging (in development) or monitoring (in production)
 */
export function logError(error: any, context?: string): void {
  const errorDetails = createErrorDetails(error)

  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, {
      ...errorDetails,
      originalError: error
    })
  } else {
    // In production, send to error monitoring service
    // Example: Sentry, LogRocket, etc.
    // sendToErrorMonitoring(errorDetails, context)
  }
}

/**
 * Handle API errors with automatic toast and logging
 */
export function handleAPIError(
  error: any,
  options: {
    showToast?: boolean
    customMessage?: string
    context?: string
    onError?: (errorDetails: ErrorDetails) => void
  } = {}
): ErrorDetails {
  const {
    showToast = true,
    customMessage,
    context,
    onError
  } = options

  const errorDetails = createErrorDetails(error)

  // Log error
  logError(error, context)

  // Show toast if enabled
  if (showToast) {
    showErrorToast(error, customMessage)
  }

  // Call custom error handler
  onError?.(errorDetails)

  return errorDetails
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    maxDelay?: number
    onRetry?: (attempt: number, error: any) => void
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    onRetry
  } = options

  let lastError: any

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt < maxRetries) {
        const delay = Math.min(
          initialDelay * Math.pow(2, attempt),
          maxDelay
        )

        onRetry?.(attempt + 1, error)

        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError
}

/**
 * Validate form data and return errors
 */
export interface ValidationError {
  field: string
  message: string
}

export function validateFormData(
  data: Record<string, any>,
  rules: Record<string, (value: any) => string | null>
): ValidationError[] {
  const errors: ValidationError[] = []

  for (const [field, validator] of Object.entries(rules)) {
    const errorMessage = validator(data[field])
    if (errorMessage) {
      errors.push({ field, message: errorMessage })
    }
  }

  return errors
}

/**
 * Common validators
 */
export const validators = {
  required: (fieldName: string) => (value: any) =>
    !value || value.toString().trim() === '' ? `${fieldName} is required` : null,

  email: (value: string) =>
    value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? 'Invalid email address'
      : null,

  phone: (value: string) =>
    value && !/^[6-9]\d{9}$/.test(value)
      ? 'Invalid phone number (must be 10 digits starting with 6-9)'
      : null,

  pincode: (value: string) =>
    value && !/^[1-9][0-9]{5}$/.test(value)
      ? 'Invalid PIN code (must be 6 digits)'
      : null,

  age: (value: number) =>
    value && (value < 18 || value > 100)
      ? 'Age must be between 18 and 100'
      : null,

  minLength: (min: number, fieldName: string) => (value: string) =>
    value && value.length < min
      ? `${fieldName} must be at least ${min} characters`
      : null,

  maxLength: (max: number, fieldName: string) => (value: string) =>
    value && value.length > max
      ? `${fieldName} must be no more than ${max} characters`
      : null,

  pattern: (pattern: RegExp, message: string) => (value: string) =>
    value && !pattern.test(value) ? message : null
}
