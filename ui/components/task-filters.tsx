"use client"

import { motion } from "framer-motion"
import type { FilterType } from "@/types/task"

interface TaskFiltersProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  activeCount: number
  completedCount: number
}

export function TaskFilters({ currentFilter, onFilterChange, activeCount, completedCount }: TaskFiltersProps) {
  const filters = [
    { key: "all" as const, label: "All", count: activeCount + completedCount },
    { key: "active" as const, label: "Active", count: activeCount },
    { key: "completed" as const, label: "Completed", count: completedCount },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="flex justify-center gap-2 mb-6"
    >
      {filters.map((filter) => (
        <motion.button
          key={filter.key}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            currentFilter === filter.key
              ? "bg-teal-500 text-white shadow-md"
              : "bg-white/60 text-slate-600 hover:bg-white/80"
          }`}
        >
          {filter.label} {filter.count > 0 && `(${filter.count})`}
        </motion.button>
      ))}
    </motion.div>
  )
}
