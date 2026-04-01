'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useStore } from '@/lib/store'
import { HISTORICAL_ELECTIONS } from '@/lib/data/historical'
import { PARTIES } from '@/lib/data/parties'
import { sortedResults } from '@/lib/utils'

export default function HistoricalComparison() {
  const { result, electionType, setVotes } = useStore()
  const [selectedElection, setSelectedElection] = useState<string | null>(null)

  const elections = useMemo(
    () => HISTORICAL_ELECTIONS.filter(e => e.electionType === electionType),
    [electionType],
  )

  const historicalElection = useMemo(
    () => elections.find(e => e.id === selectedElection),
    [elections, selectedElection],
  )

  const currentSorted = useMemo(
    () => (result ? sortedResults(result) : []),
    [result],
  )

  if (!result) return null

  const allPartyIds = Array.from(
    new Set([
      ...currentSorted.map(([id]) => id),
      ...(historicalElection?.actualSeats
        ? Object.keys(historicalElection.actualSeats)
        : []),
    ]),
  ).filter(id => {
    const current = result.totalSeats[id] ?? 0
    const historical = historicalElection?.actualSeats?.[id] ?? 0
    return current > 0 || historical > 0
  })

  // Sort by current seats descending
  allPartyIds.sort((a, b) => (result.totalSeats[b] ?? 0) - (result.totalSeats[a] ?? 0))

  const maxSeats = Math.max(
    ...allPartyIds.map(id => Math.max(
      result.totalSeats[id] ?? 0,
      historicalElection?.actualSeats?.[id] ?? 0,
    )),
    1,
  )

  return (
    <div className="space-y-6">
      {/* Election timeline */}
      <div>
        <h3 className="text-sm font-semibold text-ink-300 mb-3">Selecciona una elecció per comparar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {elections.map(election => {
            const isSelected = selectedElection === election.id
            return (
              <button
                key={election.id}
                onClick={() => setSelectedElection(isSelected ? null : election.id)}
                className={`relative rounded-xl p-4 text-left transition-all border ${
                  isSelected
                    ? 'border-gold-500/50 bg-gold-500/5'
                    : 'border-ink-700 hover:border-ink-600 bg-ink-900/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className={isSelected ? 'text-gold-400' : 'text-ink-400'} />
                  <span className={`text-sm font-semibold ${isSelected ? 'text-gold-400' : 'text-ink-200'}`}>
                    {election.name}
                  </span>
                </div>
                <span className="text-xs text-ink-400">{election.date}</span>
                {isSelected && (
                  <motion.div
                    layoutId="selectedElection"
                    className="absolute inset-0 rounded-xl border-2 border-gold-500/40"
                    transition={{ type: 'spring', bounce: 0.2 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Load historical votes button */}
      {historicalElection && (
        <button
          onClick={() => setVotes(historicalElection.votes)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/30 hover:bg-gold-500/20 transition-all"
        >
          Carregar vots de {historicalElection.name}
        </button>
      )}

      {/* Comparison chart */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-ink-300">
            {historicalElection
              ? `Simulació actual vs ${historicalElection.name}`
              : 'Distribució d\'escons actual'}
          </h3>
          {historicalElection && (
            <div className="flex items-center gap-4 text-xs text-ink-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm bg-gold-400" /> Simulació
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-sm bg-ink-400 opacity-50" /> {historicalElection.name}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {allPartyIds.map((partyId, i) => {
            const party = PARTIES[partyId as keyof typeof PARTIES]
            if (!party) return null
            const currentSeats = result.totalSeats[partyId] ?? 0
            const historicalSeats = historicalElection?.actualSeats?.[partyId] ?? 0
            const diff = currentSeats - historicalSeats
            const currentWidth = (currentSeats / maxSeats) * 100
            const historicalWidth = (historicalSeats / maxSeats) * 100

            return (
              <motion.div
                key={partyId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group"
              >
                <div className="flex items-center gap-3">
                  {/* Party label */}
                  <div className="w-16 flex-shrink-0">
                    <span className="text-xs font-bold" style={{ color: party.color }}>
                      {party.shortName}
                    </span>
                  </div>

                  {/* Bars */}
                  <div className="flex-1 space-y-0.5">
                    {/* Current simulation */}
                    <div className="h-4 bg-ink-800/50 rounded-sm overflow-hidden flex items-center">
                      <motion.div
                        className="h-full rounded-sm flex items-center px-1.5"
                        style={{ background: party.color, minWidth: currentSeats > 0 ? 20 : 0 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentWidth}%` }}
                        transition={{ delay: i * 0.03, type: 'spring', bounce: 0.1 }}
                      >
                        {currentWidth > 8 && (
                          <span className="text-xs font-bold" style={{ color: party.textColor }}>{currentSeats}</span>
                        )}
                      </motion.div>
                      {currentWidth <= 8 && currentSeats > 0 && (
                        <span className="text-xs font-bold ml-1 text-ink-300">{currentSeats}</span>
                      )}
                    </div>

                    {/* Historical */}
                    {historicalElection && (
                      <div className="h-3 bg-ink-800/30 rounded-sm overflow-hidden flex items-center">
                        <motion.div
                          className="h-full rounded-sm opacity-40"
                          style={{ background: party.color, minWidth: historicalSeats > 0 ? 12 : 0 }}
                          initial={{ width: 0 }}
                          animate={{ width: `${historicalWidth}%` }}
                          transition={{ delay: i * 0.03 + 0.1, type: 'spring', bounce: 0.1 }}
                        />
                        {historicalSeats > 0 && (
                          <span className="text-xs text-ink-500 ml-1">{historicalSeats}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Diff */}
                  {historicalElection && (
                    <div className="w-16 flex items-center gap-1 justify-end flex-shrink-0">
                      {diff > 0 ? (
                        <>
                          <TrendingUp size={12} className="text-green-400" />
                          <span className="text-xs font-bold font-mono text-green-400">+{diff}</span>
                        </>
                      ) : diff < 0 ? (
                        <>
                          <TrendingDown size={12} className="text-red-400" />
                          <span className="text-xs font-bold font-mono text-red-400">{diff}</span>
                        </>
                      ) : (
                        <>
                          <Minus size={12} className="text-ink-500" />
                          <span className="text-xs font-mono text-ink-500">0</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
