"use client"

import { useState, useCallback } from "react"
import type { Task, FilterType } from "@/types/task"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>("all")
  const [editingId, setEditingId] = useState<Number | null>(null)
  const [editText, setEditText] = useState("")

  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = tasks.filter((task) => !task.completed).length


  const updateTask = useCallback((id: Number, updates: Partial<Task>) => {
    console.log("Updating task:", id, updates)
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)))
  }, [])

  const deleteTask = useCallback((id: Number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  const toggleTask = useCallback((id: Number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }, [])

  const clearCompleted = useCallback(() => {
    const completedTasks = tasks.filter((task) => task.completed)
    setTasks((prev) => prev.filter((task) => !task.completed))
    return completedTasks.length
  }, [tasks])

  const startEdit = useCallback((id: Number, text: string) => {
    setEditingId(id)
    setEditText(text)
  }, [])

  const saveEdit = useCallback(() => {
    if (editText.trim() === "" || !editingId) return false

    updateTask(editingId, { title: editText.trim() })
    setEditingId(null)
    setEditText("")
    return true
  }, [editText, editingId, updateTask])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setEditText("")
  }, [])

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  return {
    tasks,
    setTasks,
    filteredTasks,
    filter,
    setFilter,
    completedCount,
    activeCount,
    editingId,
    editText,
    setEditText,
    updateTask,
    deleteTask,
    toggleTask,
    clearCompleted,
    startEdit,
    saveEdit,
    cancelEdit,
  }
}
