"use client"

import { motion } from "framer-motion"
import { AlertSystem } from "@/components/alert-system"
import { ProgressBar } from "@/components/progress-bar"
import { TaskFilters } from "@/components/task-filters"
import { TaskInput } from "@/components/task-input"
import { TaskList } from "@/components/task-list"
import { useAlerts } from "@/hooks/use-alerts"
import { useTasks } from "@/hooks/use-tasks"
import { Task, TodoAlert, Alert } from "@/types/task"
import { useEffect, useMemo } from "react"
export default function TodoApp() {
  const { alerts, addAlert, removeAlert } = useAlerts()
  const {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    completedCount,
    activeCount,
    editingId,
    editText,
    setEditText,
    deleteTask,
    toggleTask,
    clearCompleted,
    startEdit,
    saveEdit,
    cancelEdit,
    setTasks
  } = useTasks()

  const handleAddTask = (text: string) => {
    if (true) {
      // addAlert("success", "Task added successfully! 🎉")
    } else {
      // addAlert("error", "Please enter a valid task")
    }
  }

  const handleToggleTask = (id: Number) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      fetch(`/api/todo`, {
        method:"PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: task.id, completed: !task.completed, title: task.title })
      }).then(async (response) => {
        let status = await response.json() as TodoAlert
        addAlert(status.status, status.message)
        if(status.status === "success") {
          toggleTask(id)
        }
      })
    }
  }

  const handleDeleteTask = (id: Number) => {
    // socket.emit("delete_todo", { id: id })
    fetch(`/api/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: id })
    }).then(async (response) => {
      let status = await response.json() as TodoAlert
      addAlert(status.status, status.message)
      if(status.status === "success") {
        deleteTask(id)
      }
    })
  }

  const handleSaveEdit = () => {
    const task = tasks.find((t) => t.id === editingId)
    fetch(`/api/todo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: editingId, title: editText, completed: task?.completed })
    }).then(async (response) => {
      let status = await response.json() as TodoAlert
      addAlert(status.status, status.message)
      if(status.status === "success") {
        saveEdit()
      }
    })
  }

  const handleClearCompleted = () => {
    fetch("/api/clear", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    }).then(async (response) => {

      let status = await response.json() as TodoAlert
      addAlert(status.status, status.message)
      if(status.status === "success") {
        clearCompleted()
      }
    })
  }
  useEffect(() => {
    fetch("/api/todos").then(async (response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      const data = await response.json() as Task[]
      setTasks(data)
    }).catch((error) => {
      console.error("Error fetching tasks:", error)
      // addAlert("error", "Failed to load tasks")
    })
    addAlert("info", "Welcome to Daily Tasks! Start managing your tasks efficiently.")
  },[])
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-teal-50 to-violet-50 p-4 md:p-8">
      <AlertSystem alerts={alerts} onRemove={removeAlert} />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-2">Daily Tasks</h1>
          <p className="text-slate-500 font-light">Stay organized, stay productive</p>
        </motion.div>

        {/* Progress Bar */}
        <ProgressBar completedCount={completedCount} totalCount={tasks.length} />

        {/* Filter Buttons */}
        <TaskFilters
          currentFilter={filter}
          onFilterChange={setFilter}
          activeCount={activeCount}
          completedCount={completedCount}
        />

        {/* Task Input */}
        <TaskInput onAddTask={(title: String)=>{
          // const d = socket.emit("create_todo", { title: title, completed: false})
          // console.log("Task added:", d)
          fetch("/api/todo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ title: title, completed: false })
          }).then(async (response) => {
            interface TodoAlertWithStatus extends TodoAlert {
              todo: Task | undefined
            }
            let status = await response.json() as TodoAlertWithStatus
            if(status.todo) {
              let todo = status.todo
              setTasks((prevTasks) => [
                ...prevTasks,
                todo
              ])
            }
            addAlert(status.status, status.message)
          })
        }} />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          editingId={editingId}
          editText={editText}
          onEditTextChange={setEditText}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onStartEdit={startEdit}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={cancelEdit}
          onClearCompleted={handleClearCompleted}
          completedCount={completedCount}
        />

        {/* Footer */}
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-12 text-slate-400 text-sm"
          >
            {completedCount === tasks.length ? (
              <motion.p
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="text-emerald-500 font-medium"
              >
                🎉 All tasks completed! Great job!
              </motion.p>
            ) : (
              <p>Keep going! You're doing great.</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
