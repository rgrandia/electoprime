'use client'

import { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, ChevronDown } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getPartiesForElection } from '@/lib/data/parties'
import { HISTORICAL_ELECTIONS as HIST } from '@/lib/data/historical'
import { totalVotePct, cn } from '@/lib/utils'

export default function VoteSliders() {
  const { electionType, votes, setVote, setVotes } = useStore()
  const parties = useMemo(
    () => getPartiesForElection(electionType).filter(p => p.id !== 'OTROS'),
    [electionType],
  )
  const totalPct = useMemo(() => totalVotePct(votes), [votes])
  const remaining = Math.max(0, 100 - totalPct)
  const over = totalPct > 100

  const historicalOptions = HIST.filter(e => e.electionType === electionType)

  const loadHistorical = useCallback(
    (id: string) => {
      const election = HIST.find(e => e.id === id)
      if (election) setVotes(election.votes)
    },
    [setVotes],
  )

  const resetVotes = useCallback(() => {
    const defaults: Record<string, number> = electionType === 'spain'
      ? { PP: 30, PSOE: 29, VOX: 13, SUMAR: 13, ERC: 3, JUNTS: 2, EHBILDU: 2, PNV: 1.5, CC: 0.8, BNG: 0.7, OTROS: 5 }
      : { PSC: 28, JUNTS: 18, ERC: 14, PP: 8, ENCOMU: 7, CUP: 5, VOX: 4, AC: 4, CS: 2, OTROS: 10 }
    setVotes(defaults)
  }, [electionType, setVotes])

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-ink-200 tracking-wide uppercase">Percentatge de vot</h2>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <select
            className="w-full bg-ink-800 border border-ink-700 text-ink-100 text-xs rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-gold-500 appearance-none cursor-pointer"
            defaultValue=""
            onChange={e => e.target.value && loadHistorical(e.target.value)}
          >
            <option value="">Carregar dades historiques...</option>
            {historicalOptions.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-500 pointer-events-none" />
        </div>

        <button
          onClick={resetVotes}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-ink-400 border border-ink-700 rounded-lg hover:border-gold-500/40 hover:text-gold-400 transition-all"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Votes total indicator */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-500">Total de vots assignats</span>
          <span
            className={cn(
              'text-xs font-mono font-bold',
              over ? 'text-red-400' : totalPct > 95 ? 'text-green-400' : 'text-gold-400',
            )}
          >
            {totalPct.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-ink-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            animate={{
              width: `${Math.min(totalPct, 100)}%`,
              backgroundColor: over ? '#ef4444' : totalPct > 95 ? '#22c55e' : '#f59e0b',
            }}
            transition={{ type: 'spring', bounce: 0.1 }}
          />
        </div>
        <div className="text-xs text-ink-600">
          {over ? 'El total supera el 100%' : `${remaining.toFixed(1)}% sense assignar`}
        </div>
      </div>

      {/* Party sliders */}
      <div className="space-y-1.5">
        {parties.map((party, i) => {
          const pct = votes[party.id] ?? 0
          const max = 65

          return (
            <motion.div
              key={party.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className="group"
            >
              <div className="flex items-center gap-2">
                {/* Party badge */}
                <div
                  className="w-14 text-center text-xs font-bold rounded-md px-1.5 py-1 flex-shrink-0 transition-all group-hover:shadow-sm"
                  style={{
                    background: party.color + '18',
                    color: party.color,
                    border: `1px solid ${party.color}33`,
                  }}
                >
                  {party.shortName}
                </div>

                {/* Slider */}
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min={0}
                    max={max}
                    step={0.1}
                    value={pct}
                    onChange={e => setVote(party.id, parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-full outline-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${party.color} 0%, ${party.color} ${(pct / max) * 100}%, #1e293b ${(pct / max) * 100}%, #1e293b 100%)`,
                    }}
                  />
                </div>

                {/* Numeric input */}
                <input
                  type="number"
                  min={0}
                  max={max}
                  step={0.1}
                  value={pct.toFixed(1)}
                  onChange={e => setVote(party.id, parseFloat(e.target.value) || 0)}
                  className="w-14 text-right text-xs font-mono font-bold bg-ink-800/80 border border-ink-700/50 rounded-md px-1.5 py-1 focus:outline-none focus:border-gold-500/50 transition-colors"
                  style={{ color: party.color }}
                />
                <span className="text-xs text-ink-600 w-2">%</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Otros / Altres */}
      <div className="pt-2 border-t border-ink-800/50">
        <div className="flex items-center gap-2">
          <div className="w-14 text-center text-xs font-bold rounded-md px-1.5 py-1 flex-shrink-0 text-ink-500 border border-ink-700/50 bg-ink-800/50">
            Altres
          </div>
          <div className="flex-1 relative">
            <input
              type="range"
              min={0}
              max={30}
              step={0.1}
              value={votes['OTROS'] ?? 0}
              onChange={e => setVote('OTROS', parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full outline-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #64748b 0%, #64748b ${((votes['OTROS'] ?? 0) / 30) * 100}%, #1e293b ${((votes['OTROS'] ?? 0) / 30) * 100}%, #1e293b 100%)`,
              }}
            />
          </div>
          <input
            type="number"
            min={0}
            max={30}
            step={0.1}
            value={(votes['OTROS'] ?? 0).toFixed(1)}
            onChange={e => setVote('OTROS', parseFloat(e.target.value) || 0)}
            className="w-14 text-right text-xs font-mono bg-ink-800/80 border border-ink-700/50 rounded-md px-1.5 py-1 text-ink-500 focus:outline-none focus:border-gold-500/50 transition-colors"
          />
          <span className="text-xs text-ink-600 w-2">%</span>
        </div>
      </div>
    </div>
  )
}
