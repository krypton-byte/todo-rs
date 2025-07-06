"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Circle } from "lucide-react"
import { TaskItem } from "./task-item"
import type { Task } from "@/types/task"

interface TaskListProps {
  tasks: Task[]
  editingId: Number | null
  editText: string
  onEditTextChange: (text: string) => void
  onToggleTask: (id: Number) => void
  onDeleteTask: (id: Number) => void
  onStartEdit: (id: Number, text: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onClearCompleted: () => void
  completedCount: number
}

export function TaskList({
  tasks,
  editingId,
  editText,
  onEditTextChange,
  onToggleTask,
  onDeleteTask,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onClearCompleted,
  completedCount,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center py-12"
      >
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
          <Circle className="w-12 h-12 text-teal-400" />
        </div>
        <h3 className="text-xl font-light text-slate-600 mb-2">No tasks yet</h3>
        <p className="text-slate-400">Add your first task to get started</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {tasks.slice().reverse().map((task, index) => (
          <motion.div
            key={task.id.toString()}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: "easeOut",
            }}
            layout
            className="group"
          >
            <TaskItem
              task={task}
              isEditing={editingId === task.id}
              editText={editText}
              onEditTextChange={onEditTextChange}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
              onStartEdit={() => onStartEdit(task.id, task.title)}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Clear Completed Button */}
      {completedCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClearCompleted}
            className="px-6 py-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-full text-sm font-medium transition-all duration-300"
          >
            Clear Completed ({completedCount})
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
