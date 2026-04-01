'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Check, AlertTriangle } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getPartiesForElection, PARTIES } from '@/lib/data/parties'
import { sortedResults } from '@/lib/utils'

const PRESET_COALITIONS: Record<string, { label: string; parties: Record<string, string[]> }> = {
  'left': { label: 'Bloc d\'Esquerres', parties: { spain: ['PSOE', 'SUMAR', 'EHBILDU', 'ERC', 'BNG'], catalonia: ['PSC', 'ERC', 'ENCOMU', 'CUP'] } },
  'right': { label: 'Bloc de Dretes', parties: { spain: ['PP', 'VOX'], catalonia: ['PP', 'VOX', 'CS'] } },
  'grand': { label: 'Gran Coalició', parties: { spain: ['PP', 'PSOE'], catalonia: ['PSC', 'JUNTS'] } },
  'indy': { label: 'Bloc Independentista', parties: { spain: ['ERC', 'JUNTS', 'EHBILDU', 'BNG'], catalonia: ['JUNTS', 'ERC', 'CUP'] } },
}

export default function CoalitionBuilder() {
  const { result, electionType } = useStore()
  const [selectedParties, setSelectedParties] = useState<string[]>([])

  const parties = useMemo(
    () => getPartiesForElection(electionType).filter(p => p.id !== 'OTROS'),
    [electionType],
  )

  const sorted = useMemo(() => result ? sortedResults(result) : [], [result])

  const coalitionSeats = useMemo(() => {
    if (!result) return 0
    return selectedParties.reduce((sum, id) => sum + (result.totalSeats[id] ?? 0), 0)
  }, [result, selectedParties])

  const majority = result?.majorityNeeded ?? 176
  const hasMajority = coalitionSeats >= majority
  const progress = Math.min((coalitionSeats / majority) * 100, 100)

  const toggleParty = (id: string) => {
    setSelectedParties(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id],
    )
  }

  const loadPreset = (key: string) => {
    const preset = PRESET_COALITIONS[key]
    if (!preset) return
    const partyList = preset.parties[electionType] ?? []
    setSelectedParties(partyList.filter(p => sorted.some(([id]) => id === p)))
  }

  if (!result) return null

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <h3 className="text-sm font-semibold text-ink-300 mb-3">Coalicions predefinides</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESET_COALITIONS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-ink-700 text-ink-300 hover:border-gold-500/40 hover:text-gold-400 transition-all"
            >
              {preset.label}
            </button>
          ))}
          <button
            onClick={() => setSelectedParties([])}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-ink-700 text-ink-400 hover:border-red-500/40 hover:text-red-400 transition-all"
          >
            Netejar
          </button>
        </div>
      </div>

      {/* Majority progress */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-ink-300">Progrés cap a la majoria</span>
          <span className={`text-sm font-bold font-mono ${hasMajority ? 'text-green-400' : 'text-gold-400'}`}>
            {coalitionSeats} / {majority}
          </span>
        </div>
        <div className="h-3 bg-ink-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0.1 }}
            style={{
              background: hasMajority
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : `linear-gradient(90deg, #f59e0b, #fbbf24)`,
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            {hasMajority ? (
              <>
                <Check size={14} className="text-green-400" />
                <span className="text-xs text-green-400 font-medium">Majoria absoluta aconseguida!</span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} className="text-gold-400" />
                <span className="text-xs text-gold-400">Falten {majority - coalitionSeats} escons</span>
              </>
            )}
          </div>
          {selectedParties.length > 0 && (
            <span className="text-xs text-ink-400">
              {selectedParties.length} {selectedParties.length === 1 ? 'partit' : 'partits'}
            </span>
          )}
        </div>
      </div>

      {/* Party selector grid */}
      <div>
        <h3 className="text-sm font-semibold text-ink-300 mb-3">Selecciona partits</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {sorted.map(([partyId, seats]) => {
            const party = PARTIES[partyId as keyof typeof PARTIES]
            if (!party || seats === 0) return null
            const isSelected = selectedParties.includes(partyId)
            const pct = result.totalVotes[partyId] ?? 0

            return (
              <motion.button
                key={partyId}
                onClick={() => toggleParty(partyId)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative rounded-xl p-3 text-left transition-all border ${
                  isSelected
                    ? 'border-opacity-60 shadow-lg'
                    : 'border-ink-700 hover:border-ink-600'
                }`}
                style={{
                  borderColor: isSelected ? party.color : undefined,
                  background: isSelected ? `${party.color}15` : '#0d1420',
                }}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: party.color }}
                  >
                    <Check size={12} className="text-white" />
                  </motion.div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: party.color }}
                  />
                  <span className="text-sm font-bold" style={{ color: party.color }}>
                    {party.shortName}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black font-mono text-ink-100">{seats}</span>
                  <span className="text-xs text-ink-400">escons</span>
                </div>
                <span className="text-xs text-ink-500 font-mono">{pct.toFixed(1)}%</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Selected coalition summary */}
      <AnimatePresence>
        {selectedParties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-4 overflow-hidden"
          >
            <h3 className="text-sm font-semibold text-ink-300 mb-3">Composició de la coalició</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedParties.map(id => {
                const party = PARTIES[id as keyof typeof PARTIES]
                if (!party) return null
                const seats = result.totalSeats[id] ?? 0
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{ background: `${party.color}20`, border: `1px solid ${party.color}40` }}
                  >
                    <span className="text-sm font-bold" style={{ color: party.color }}>{party.shortName}</span>
                    <span className="text-xs font-mono text-ink-300">{seats}</span>
                    <button
                      onClick={() => toggleParty(id)}
                      className="text-ink-500 hover:text-red-400 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Coalition bar */}
            <div className="h-6 rounded-lg overflow-hidden flex">
              {selectedParties.map(id => {
                const party = PARTIES[id as keyof typeof PARTIES]
                if (!party) return null
                const seats = result.totalSeats[id] ?? 0
                const pct = coalitionSeats > 0 ? (seats / coalitionSeats) * 100 : 0
                return (
                  <motion.div
                    key={id}
                    className="h-full flex items-center justify-center text-xs font-bold"
                    style={{ background: party.color, width: `${pct}%`, color: party.textColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: 'spring', bounce: 0.1 }}
                  >
                    {pct > 12 && party.shortName}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
