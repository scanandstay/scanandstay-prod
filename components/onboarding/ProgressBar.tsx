'use client'

import { motion } from 'framer-motion'

interface Props { current: number; total: number }

export default function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="mb-7">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-forest-600 uppercase tracking-widest">
          Étape {current} / {total}
        </span>
        <span className="text-[11px] text-stone-400 font-medium">{pct}%</span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-stone-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-forest-500 to-forest-600"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              i + 1 <= current ? 'bg-forest-500' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
