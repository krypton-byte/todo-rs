"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Check, X, Circle, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Task } from "@/types/task"

interface TaskItemProps {
  task: Task
  isEditing: boolean
  editText: string
  onEditTextChange: (text: string) => void
  onToggle: () => void
  onDelete: () => void
  onStartEdit: () => void
  onSaveEdit: () => void
  onCancelEdit: () => void
}

export function TaskItem({
  task,
  isEditing,
  editText,
  onEditTextChange,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
}: TaskItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-rose-400 bg-rose-50/50"
      case "medium":
        return "border-l-amber-400 bg-amber-50/50"
      case "low":
        return "border-l-emerald-400 bg-emerald-50/50"
      default:
        return "border-l-slate-300"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSaveEdit()
    if (e.key === "Escape") onCancelEdit()
  }

  return (
    <div
      className={`bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 ${getPriorityColor("medium")}`}
    >
      <div className="flex items-center gap-4">
        {/* Complete Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            task.completed
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-slate-300 hover:border-emerald-400"
          }`}
        >
          {task.completed ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-4 h-4" />
            </motion.div>
          ) : (
            <Circle className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
          )}
        </motion.button>

        {/* Task Text or Edit Input */}
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={editText}
              onChange={(e) => onEditTextChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-white border-teal-300 focus:border-teal-500"
              autoFocus
            />
          ) : (
            <motion.p
              className={`text-lg transition-all duration-300 cursor-pointer ${
                task.completed ? "text-slate-400 line-through" : "text-slate-700"
              }`}
              animate={{
                opacity: task.completed ? 0.6 : 1,
              }}
              transition={{ duration: 0.3 }}
              onDoubleClick={() => !task.completed && onStartEdit()}
            >
              {task.title}
            </motion.p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSaveEdit}
                className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 flex items-center justify-center"
              >
                <Check className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCancelEdit}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </>
          ) : (
            <>
              {!task.completed && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onStartEdit}
                  className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center"
                >
                  <Edit className="w-4 h-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onDelete}
                className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 hover:bg-rose-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
