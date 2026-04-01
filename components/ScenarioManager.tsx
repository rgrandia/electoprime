'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Trash2, Eye, Plus, X, GitCompare } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PARTIES } from '@/lib/data/parties'
import type { Scenario } from '@/lib/types'
import { sortedResults } from '@/lib/utils'

export default function ScenarioManager() {
  const { scenarios, saveScenario, removeScenario, clearScenarios, setVotes, setElectionType, result, votes, electionType } = useStore()
  const [newName, setNewName] = useState('')
  const [comparing, setComparing] = useState<string[]>([])

  const handleSave = () => {
    if (!newName.trim()) return
    saveScenario(newName.trim())
    setNewName('')
  }

  const handleLoad = (scenario: Scenario) => {
    setElectionType(scenario.electionType)
    setVotes(scenario.votes)
  }

  const toggleCompare = (id: string) => {
    setComparing(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    )
  }

  const comparedScenarios = useMemo(
    () => scenarios.filter(s => comparing.includes(s.id)),
    [scenarios, comparing],
  )

  // Get all parties that appear in any compared scenario
  const comparisonParties = useMemo(() => {
    if (comparedScenarios.length === 0) return []
    const partySet = new Set<string>()
    for (const s of comparedScenarios) {
      if (s.result) {
        for (const [id, seats] of Object.entries(s.result.totalSeats)) {
          if (seats > 0) partySet.add(id)
        }
      }
    }
    return Array.from(partySet).sort((a, b) => {
      const maxA = Math.max(...comparedScenarios.map(s => s.result?.totalSeats[a] ?? 0))
      const maxB = Math.max(...comparedScenarios.map(s => s.result?.totalSeats[b] ?? 0))
      return maxB - maxA
    })
  }, [comparedScenarios])

  return (
    <div className="space-y-6">
      {/* Save new scenario */}
      <div className="glass rounded-xl p-4">
        <h3 className="text-sm font-semibold text-ink-300 mb-3">Guardar escenari actual</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="Nom de l'escenari..."
            className="flex-1 bg-ink-800 border border-ink-700 text-ink-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gold-500 placeholder:text-ink-600"
          />
          <button
            onClick={handleSave}
            disabled={!newName.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-gold-500/10 text-gold-400 border border-gold-500/30 hover:bg-gold-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            Guardar
          </button>
        </div>
      </div>

      {/* Scenarios list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ink-300">
            Escenaris guardats ({scenarios.length}/5)
          </h3>
          {scenarios.length > 0 && (
            <button
              onClick={clearScenarios}
              className="text-xs text-ink-500 hover:text-red-400 transition-colors"
            >
              Esborrar tots
            </button>
          )}
        </div>

        {scenarios.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <Plus size={24} className="mx-auto text-ink-600 mb-2" />
            <p className="text-sm text-ink-500">Cap escenari guardat encara</p>
            <p className="text-xs text-ink-600 mt-1">Ajusta els vots i guarda un escenari per comparar</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {scenarios.map(scenario => {
                const isComparing = comparing.includes(scenario.id)
                const sorted = scenario.result ? sortedResults(scenario.result).slice(0, 5) : []
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`glass rounded-xl p-4 transition-all ${
                      isComparing ? 'border-gold-500/40' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-ink-100 truncate">{scenario.name}</h4>
                          <span className="text-xs text-ink-500 px-2 py-0.5 rounded-full bg-ink-800 flex-shrink-0">
                            {scenario.electionType === 'spain' ? 'ES' : 'CAT'}
                          </span>
                        </div>
                        <p className="text-xs text-ink-500">
                          {new Date(scenario.createdAt).toLocaleString('ca-ES', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>

                        {/* Mini results bar */}
                        {sorted.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5">
                            {sorted.map(([pid, seats]) => {
                              const party = PARTIES[pid as keyof typeof PARTIES]
                              if (!party) return null
                              return (
                                <div key={pid} className="flex items-center gap-1">
                                  <div className="w-2 h-2 rounded-full" style={{ background: party.color }} />
                                  <span className="text-xs font-mono" style={{ color: party.color }}>{seats}</span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleLoad(scenario)}
                          className="p-1.5 rounded-lg text-ink-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                          title="Carregar"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => toggleCompare(scenario.id)}
                          className={`p-1.5 rounded-lg transition-all ${
                            isComparing
                              ? 'text-gold-400 bg-gold-500/10'
                              : 'text-ink-400 hover:text-gold-400 hover:bg-gold-500/10'
                          }`}
                          title="Comparar"
                        >
                          <GitCompare size={14} />
                        </button>
                        <button
                          onClick={() => removeScenario(scenario.id)}
                          className="p-1.5 rounded-lg text-ink-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Esborrar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Comparison view */}
      <AnimatePresence>
        {comparedScenarios.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-ink-300">Comparació d&apos;escenaris</h3>
                <button
                  onClick={() => setComparing([])}
                  className="text-xs text-ink-500 hover:text-ink-300 transition-colors"
                >
                  Tancar
                </button>
              </div>

              {/* Comparison table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-ink-800">
                      <th className="text-left py-2 px-2 text-ink-400 font-medium">Partit</th>
                      {comparedScenarios.map(s => (
                        <th key={s.id} className="text-center py-2 px-2 text-ink-300 font-medium">{s.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonParties.map(pid => {
                      const party = PARTIES[pid as keyof typeof PARTIES]
                      if (!party) return null
                      return (
                        <tr key={pid} className="border-b border-ink-800/50">
                          <td className="py-1.5 px-2">
                            <span className="font-bold" style={{ color: party.color }}>{party.shortName}</span>
                          </td>
                          {comparedScenarios.map(s => {
                            const seats = s.result?.totalSeats[pid] ?? 0
                            return (
                              <td key={s.id} className="text-center py-1.5 px-2 font-mono font-bold text-ink-200">
                                {seats}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                    <tr className="border-t-2 border-ink-700">
                      <td className="py-2 px-2 font-bold text-ink-300">Total</td>
                      {comparedScenarios.map(s => {
                        const total = s.result ? Object.values(s.result.totalSeats).reduce((a, b) => a + b, 0) : 0
                        return (
                          <td key={s.id} className="text-center py-2 px-2 font-mono font-bold text-gold-400">
                            {total}
                          </td>
                        )
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
