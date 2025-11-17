"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { api, APIConfig, APIError } from '@/lib/api'

export interface UseAPIOptions<T> extends APIConfig {
  initialData?: T
  enabled?: boolean
  refetchOnMount?: boolean
  refetchInterval?: number
  onSuccess?: (data: T) => void
  onError?: (error: APIError) => void
}

export interface UseAPIResult<T> {
  data: T | undefined
  error: APIError | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  refetch: () => Promise<void>
  mutate: (data: T) => void
}

/**
 * Custom hook for GET requests with automatic fetching
 */
export function useAPI<T = any>(
  url: string | null,
  options: UseAPIOptions<T> = {}
): UseAPIResult<T> {
  const {
    initialData,
    enabled = true,
    refetchOnMount = true,
    refetchInterval,
    onSuccess,
    onError,
    ...apiConfig
  } = options

  const [data, setData] = useState<T | undefined>(initialData)
  const [error, setError] = useState<APIError | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isMounted = useRef(true)
  const intervalRef = useRef<NodeJS.Timeout>()

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get<T>(url, apiConfig)

      if (isMounted.current) {
        setData(response.data)
        setError(null)
        onSuccess?.(response.data)
      }
    } catch (err: any) {
      if (isMounted.current) {
        const apiError: APIError = err
        setError(apiError)
        onError?.(apiError)
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false)
      }
    }
  }, [url, enabled, onSuccess, onError])

  // Initial fetch
  useEffect(() => {
    if (refetchOnMount) {
      fetchData()
    }
  }, [fetchData, refetchOnMount])

  // Interval refetch
  useEffect(() => {
    if (refetchInterval && enabled) {
      intervalRef.current = setInterval(() => {
        fetchData()
      }, refetchInterval)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [refetchInterval, enabled, fetchData])

  // Cleanup
  useEffect(() => {
    return () => {
      isMounted.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const mutate = useCallback((newData: T) => {
    setData(newData)
  }, [])

  return {
    data,
    error,
    isLoading,
    isError: error !== null,
    isSuccess: data !== undefined && error === null,
    refetch: fetchData,
    mutate
  }
}

/**
 * Custom hook for POST/PUT/DELETE mutations
 */
export interface UseMutationOptions<TData = any, TVariables = any> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: APIError, variables: TVariables) => void
  onSettled?: (data: TData | undefined, error: APIError | null, variables: TVariables) => void
}

export interface UseMutationResult<TData = any, TVariables = any> {
  mutate: (variables: TVariables) => Promise<void>
  mutateAsync: (variables: TVariables) => Promise<TData>
  data: TData | undefined
  error: APIError | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  reset: () => void
}

export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
): UseMutationResult<TData, TVariables> {
  const { onSuccess, onError, onSettled } = options

  const [data, setData] = useState<TData | undefined>()
  const [error, setError] = useState<APIError | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const mutateAsync = useCallback(async (variables: TVariables): Promise<TData> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await mutationFn(variables)
      setData(result)
      onSuccess?.(result, variables)
      onSettled?.(result, null, variables)
      return result
    } catch (err: any) {
      const apiError: APIError = err
      setError(apiError)
      onError?.(apiError, variables)
      onSettled?.(undefined, apiError, variables)
      throw apiError
    } finally {
      setIsLoading(false)
    }
  }, [mutationFn, onSuccess, onError, onSettled])

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      await mutateAsync(variables)
    } catch {
      // Error already handled in mutateAsync
    }
  }, [mutateAsync])

  const reset = useCallback(() => {
    setData(undefined)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    mutate,
    mutateAsync,
    data,
    error,
    isLoading,
    isError: error !== null,
    isSuccess: data !== undefined && error === null,
    reset
  }
}

/**
 * Hook for infinite scrolling/pagination
 */
export interface UsePaginationOptions<T> extends APIConfig {
  initialPage?: number
  pageSize?: number
  onSuccess?: (data: T[], page: number) => void
  onError?: (error: APIError) => void
}

export interface UsePaginationResult<T> {
  data: T[]
  error: APIError | null
  isLoading: boolean
  isFetchingMore: boolean
  hasMore: boolean
  currentPage: number
  fetchMore: () => Promise<void>
  refetch: () => Promise<void>
  reset: () => void
}

export function usePagination<T = any>(
  url: string | null,
  options: UsePaginationOptions<T> = {}
): UsePaginationResult<T> {
  const {
    initialPage = 1,
    pageSize = 10,
    onSuccess,
    onError,
    ...apiConfig
  } = options

  const [data, setData] = useState<T[]>([])
  const [error, setError] = useState<APIError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [hasMore, setHasMore] = useState(true)

  const fetchPage = useCallback(async (page: number, append: boolean = false) => {
    if (!url) return

    const loadingSetter = append ? setIsFetchingMore : setIsLoading
    loadingSetter(true)
    setError(null)

    try {
      const pageUrl = `${url}${url.includes('?') ? '&' : '?'}page=${page}&limit=${pageSize}`
      const response = await api.get<T[]>(pageUrl, apiConfig)

      const newData = response.data
      setData(prev => append ? [...prev, ...newData] : newData)
      setHasMore(newData.length === pageSize)
      onSuccess?.(newData, page)
    } catch (err: any) {
      const apiError: APIError = err
      setError(apiError)
      onError?.(apiError)
    } finally {
      loadingSetter(false)
    }
  }, [url, pageSize, onSuccess, onError])

  // Initial fetch
  useEffect(() => {
    fetchPage(initialPage, false)
  }, [])

  const fetchMore = useCallback(async () => {
    if (!hasMore || isFetchingMore) return

    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    await fetchPage(nextPage, true)
  }, [currentPage, hasMore, isFetchingMore, fetchPage])

  const refetch = useCallback(async () => {
    setCurrentPage(initialPage)
    await fetchPage(initialPage, false)
  }, [initialPage, fetchPage])

  const reset = useCallback(() => {
    setData([])
    setError(null)
    setCurrentPage(initialPage)
    setHasMore(true)
  }, [initialPage])

  return {
    data,
    error,
    isLoading,
    isFetchingMore,
    hasMore,
    currentPage,
    fetchMore,
    refetch,
    reset
  }
}
