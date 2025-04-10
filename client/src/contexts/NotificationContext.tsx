'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import toast, { Toast, Toaster } from 'react-hot-toast'

type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface NotificationContextType {
  notify: (message: string, type: NotificationType) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
  dismiss: (toastId?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const notify = (message: string, type: NotificationType) => {
    switch (type) {
      case 'success':
        return toast.success(message)
      case 'error':
        return toast.error(message)
      case 'info':
        return toast(message)
      case 'warning':
        return toast(message, {
          icon: '⚠️',
          style: {
            backgroundColor: '#fff7cd',
            color: '#7a4f01',
          },
        })
      default:
        return toast(message)
    }
  }

  const success = (message: string) => notify(message, 'success')
  const error = (message: string) => notify(message, 'error')
  const info = (message: string) => notify(message, 'info')
  const warning = (message: string) => notify(message, 'warning')
  const dismiss = (toastId?: string) => toast.dismiss(toastId)

  const value = {
    notify,
    success,
    error,
    info,
    warning,
    dismiss,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            border: '1px solid #E0E0E0',
            padding: '12px',
            color: '#424242',
            borderRadius: '8px',
          },
        }}
      />
    </NotificationContext.Provider>
  )
}
