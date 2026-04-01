'use client'

import { useCallback, useMemo } from 'react'
import { Lock, Unlock, RotateCcw } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PARTIES, getPartiesForElection, HISTORICAL_ELECTIONS } from '@/lib/data/parties'
import { HISTORICAL_ELECTIONS as HIST } from '@/lib/data/historical'
import { totalVotePct, cn, formatPct } from '@/lib/utils'

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
    const defaults = electionType === 'spain'
      ? { PP: 30, PSOE: 29, VOX: 13, SUMAR: 13, ERC: 3, JUNTS: 2, EHBILDU: 2, PNV: 1.5, CC: 0.8, BNG: 0.7, OTROS: 5 }
      : { PSC: 28, JUNTS: 18, ERC: 14, PP: 8, ENCOMU: 7, CUP: 5, VOX: 4, AC: 4, CS: 2, OTROS: 10 }
    setVotes(defaults)
  }, [electionType, setVotes])

  return (
    <div className="space-y-4">
      {/* Controls row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs text-ink-400 mb-1">Carregar dades histò riques</p>
          <select
            className="bg-ink-800 border border-ink-700 text-ink-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gold-500"
            defaultValue=""
            onChange={e => e.target.value && loadHistorical(e.target.value)}
          >
            <option value="">Selecciona elecció...</option>
            {historicalOptions.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={resetVotes}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-ink-400 border border-ink-700 rounded-lg hover:border-ink-500 hover:text-ink-200 transition-colors"
        >
          <RotateCcw size={13} />
          Restablir
        </button>
      </div>

      {/* Votes total indicator */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-ink-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(totalPct, 100)}%`,
              background: over ? '#ef4444' : totalPct > 95 ? '#22c55e' : '#f59e0b',
            }}
          />
        </div>
        <span
          className={cn(
            'text-xs font-mono font-bold',
            over ? 'text-red-400' : totalPct > 95 ? 'text-green-400' : 'text-gold-400',
          )}
        >
          {totalPct.toFixed(1)}% {over ? '⚠ Excés' : `(${remaining.toFixed(1)}% resta)`}
        </span>
      </div>

      {/* Party sliders */}
      <div className="space-y-2.5">
        {parties.map(party => {
          const pct = votes[party.id] ?? 0
          const max = 65

          return (
            <div key={party.id} className="group">
              <div className="flex items-center gap-2 mb-1">
                {/* Party badge */}
                <div
                  className="w-14 text-center text-xs font-bold rounded-md px-1.5 py-0.5 flex-shrink-0"
                  style={{ background: party.color + '22', color: party.color, border: `1px solid ${party.color}44` }}
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
                    className="w-full appearance-none h-1.5 rounded-full outline-none cursor-pointer"
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
                  className="w-16 text-right text-xs font-mono font-bold bg-ink-800 border border-ink-700 rounded-md px-2 py-1 text-ink-100 focus:outline-none focus:border-ink-500"
                  style={{ color: party.color }}
                />
                <span className="text-xs text-ink-500 w-2">%</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Otros / Altres */}
      <div className="pt-2 border-t border-ink-800">
        <div className="flex items-center gap-2">
          <div className="w-14 text-center text-xs font-bold rounded-md px-1.5 py-0.5 flex-shrink-0 text-ink-400 border border-ink-700 bg-ink-800">
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
              className="w-full appearance-none h-1.5 rounded-full outline-none cursor-pointer"
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
            className="w-16 text-right text-xs font-mono bg-ink-800 border border-ink-700 rounded-md px-2 py-1 text-ink-400 focus:outline-none focus:border-ink-500"
          />
          <span className="text-xs text-ink-500 w-2">%</span>
        </div>
      </div>

      <style jsx>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
          border: 2px solid rgba(255,255,255,0.3);
        }
        input[type=range]::-moz-range-thumb {
          height: 14px;
          width: 14px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  )
}
