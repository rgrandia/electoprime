'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { PARTIES } from '@/lib/data/parties'
import { sortedResults } from '@/lib/utils'

export default function ResultsPanel() {
  const { result } = useStore()

  const sorted = useMemo(() => result ? sortedResults(result) : [], [result])
  const totalSeats = useMemo(
    () => result ? Object.values(result.totalSeats).reduce((a, b) => a + b, 0) : 0,
    [result],
  )

  if (!result || sorted.length === 0) return null

  const maxSeats = sorted[0][1]

  return (
    <div className="glass rounded-xl p-4">
      <h3 className="text-sm font-semibold text-ink-300 mb-3">Distribució d&apos;escons</h3>

      {/* Stacked bar */}
      <div className="h-8 rounded-lg overflow-hidden flex mb-4">
        {sorted.map(([partyId, seats]) => {
          const party = PARTIES[partyId as keyof typeof PARTIES]
          if (!party || seats === 0) return null
          const pct = (seats / totalSeats) * 100
          return (
            <motion.div
              key={partyId}
              className="h-full flex items-center justify-center overflow-hidden"
              style={{ background: party.color, color: party.textColor }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', bounce: 0.1, delay: 0.1 }}
              title={`${party.shortName}: ${seats} escons (${pct.toFixed(1)}%)`}
            >
              {pct > 5 && (
                <span className="text-xs font-bold truncate px-1">{seats}</span>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Individual bars */}
      <div className="space-y-1.5">
        {sorted.map(([partyId, seats], i) => {
          const party = PARTIES[partyId as keyof typeof PARTIES]
          if (!party || seats === 0) return null
          const pct = (seats / totalSeats) * 100
          const barWidth = (seats / maxSeats) * 100

          return (
            <motion.div
              key={partyId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2"
            >
              <div
                className="w-12 text-xs font-bold text-right flex-shrink-0"
                style={{ color: party.color }}
              >
                {party.shortName}
              </div>
              <div className="flex-1 h-5 bg-ink-800/40 rounded-sm overflow-hidden">
                <motion.div
                  className="h-full rounded-sm flex items-center px-1.5"
                  style={{ background: party.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ delay: i * 0.03, type: 'spring', bounce: 0.1 }}
                >
                  {barWidth > 15 && (
                    <span className="text-xs font-bold" style={{ color: party.textColor }}>{seats}</span>
                  )}
                </motion.div>
              </div>
              {barWidth <= 15 && (
                <span className="text-xs font-mono font-bold text-ink-300 w-6">{seats}</span>
              )}
              <span className="text-xs font-mono text-ink-500 w-12 text-right">{pct.toFixed(1)}%</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
