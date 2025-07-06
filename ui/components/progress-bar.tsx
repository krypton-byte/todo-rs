"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  completedCount: number
  totalCount: number
}

export function ProgressBar({ completedCount, totalCount }: ProgressBarProps) {
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600">Progress</span>
        <span className="text-sm font-medium text-slate-600">
          {completedCount} of {totalCount} completed
        </span>
      </div>
      <div className="w-full bg-white/60 rounded-full h-3 shadow-inner">
        <motion.div
          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}
