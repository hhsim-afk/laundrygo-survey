'use client'

import { motion } from 'framer-motion'

interface Props {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export default function ProgressBar({ currentStep, totalSteps, stepLabels }: Props) {
  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium" style={{ color: '#004D43' }}>
          {stepLabels[currentStep]}
        </span>
        <span className="text-xs" style={{ color: '#9CA3AF' }}>
          {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: '#00C7AE' }}
          animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i <= currentStep ? '#00C7AE' : '#E5E7EB' }}
          />
        ))}
      </div>
    </div>
  )
}
