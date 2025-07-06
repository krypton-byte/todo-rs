export interface Task {
  id: Number
  title: string
  completed: boolean
}

export type FilterType = "all" | "active" | "completed"
export type AlertType = "success" | "error" | "info" | "warning"
export interface TodoAlert {
  status: AlertType
  message: string
}

export interface Alert {
  id: string
  type: AlertType
  message: string
  duration?: number
}
