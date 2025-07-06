"use client"

import { useState, useCallback } from "react"
import type { Alert, AlertType } from "@/types/task"

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = useCallback((type: AlertType, message: string, duration = 3000) => {
    const id = Date.now().toString()
    const newAlert: Alert = { id, type, message, duration }

    setAlerts((prev) => [...prev, newAlert])

    if (duration > 0) {
      setTimeout(() => {
        removeAlert(id)
      }, duration)
    }
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  const clearAlerts = useCallback(() => {
    setAlerts([])
  }, [])

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
  }
}
