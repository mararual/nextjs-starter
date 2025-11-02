/**
 * Common TypeScript types for the application
 */

export type WithChildren<T = object> = T & {
  children: React.ReactNode
}

export type WithClassName<T = object> = T & {
  className?: string
}

export type PropsWithChildren = {
  children: React.ReactNode
}

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type ApiError = {
  code: string
  message: string
  details?: unknown
}
