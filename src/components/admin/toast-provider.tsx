"use client"

import React, { createContext, useContext, useCallback, type ReactNode } from "react"
import { toast as sonnerToast, Toaster as SonnerToaster, type ToasterProps } from "sonner"
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react"

type ToastType = "success" | "error" | "warning" | "info" | "loading"

interface ToastContextType {
  success: (message: string, options?: Record<string, unknown>) => void
  error: (message: string, options?: Record<string, unknown>) => void
  warning: (message: string, options?: Record<string, unknown>) => void
  info: (message: string, options?: Record<string, unknown>) => void
  loading: (message: string, options?: Record<string, unknown>) => void
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: Error) => string)
    }
  ) => Promise<T>
  dismiss: (toastId?: string | number) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const success = useCallback((message: string, options = {}) => {
    sonnerToast.success(message, {
      icon: <CheckCircle2 className="size-4 text-green-500" />,
      duration: 4000,
      className: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
      ...options,
    })
  }, [])

  const error = useCallback((message: string, options = {}) => {
    sonnerToast.error(message, {
      icon: <XCircle className="size-4 text-red-500" />,
      duration: 5000,
      className: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
      ...options,
    })
  }, [])

  const warning = useCallback((message: string, options = {}) => {
    sonnerToast(message, {
      icon: <AlertTriangle className="size-4 text-amber-500" />,
      duration: 4000,
      className: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100",
      ...options,
    })
  }, [])

  const info = useCallback((message: string, options = {}) => {
    sonnerToast(message, {
      icon: <Info className="size-4 text-blue-500" />,
      duration: 3000,
      className: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
      ...options,
    })
  }, [])

  const loading = useCallback((message: string, options = {}) => {
    const id = sonnerToast.loading(message, {
      icon: <Loader2 className="size-4 animate-spin" />,
      duration: Infinity,
      className: "bg-muted border-border",
      ...options,
    })
    return id
  }, [])

  const promise = useCallback(
    <T,>(
      promise: Promise<T>,
      options: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: Error) => string)
      }
    ): Promise<T> => {
      return sonnerToast.promise(promise, {
        loading: options.loading,
        success: options.success,
        error: options.error,
      }) as unknown as Promise<T>
    },
    []
  )

  const dismiss = useCallback((toastId?: string | number) => {
    sonnerToast.dismiss(toastId)
  }, [])

  const value: ToastContextType = {
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export function ToastContainer(props: Omit<ToasterProps, "children">) {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={3000}
      toastOptions={{
        style: {
          border: "1px solid hsl(var(--border))",
          borderRadius: "var(--radius)",
        },
      }}
      {...props}
    />
  )
}

// Convenience hook for CRUD-related toasts
export function useCrudToasts(modelName: string) {
  const { success, error, warning, info } = useToast()

  return {
    onSuccess: (operation: "create" | "update" | "delete" | "fetch") => {
      const messages = {
        create: `${modelName.charAt(0).toUpperCase() + modelName.slice(1)} created successfully`,
        update: `${modelName.charAt(0).toUpperCase() + modelName.slice(1)} updated successfully`,
        delete: `${modelName.charAt(0).toUpperCase() + modelName.slice(1)} deleted successfully`,
        fetch: `${modelName.charAt(0).toUpperCase() + modelName.slice(1)} loaded`,
      }
      success(messages[operation])
    },
    onError: (operation: "create" | "update" | "delete" | "fetch", err: Error) => {
      error(`Failed to ${operation} ${modelName}: ${err.message}`)
    },
    onBulkDelete: (count: number) => {
      success(`Successfully deleted ${count} record${count !== 1 ? "s" : ""}`)
    },
    onBulkError: (count: number, err: Error) => {
      error(`Failed to delete ${count} record${count !== 1 ? "s" : ""}: ${err.message}`)
    },
  }
}
