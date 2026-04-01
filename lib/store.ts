'use client'

import { create } from 'zustand'
import type { ElectionType, ElectionResult, Scenario } from '@/lib/types'
import { DEFAULT_SPAIN_VOTES, DEFAULT_CATALONIA_VOTES } from '@/lib/data/parties'
import { calculateElection } from '@/lib/dhondt'
import { CATALONIA_CONSTITUENCY_VOTES } from '@/lib/data/historical'

interface Store {
  // ── Election type ──
  electionType: ElectionType
  setElectionType: (type: ElectionType) => void

  // ── Current votes ──
  votes: Record<string, number>
  setVote: (partyId: string, pct: number) => void
  setVotes: (votes: Record<string, number>) => void

  // ── Calculated result ──
  result: ElectionResult | null
  recalculate: () => void

  // ── Scenarios ──
  scenarios: Scenario[]
  saveScenario: (name: string) => void
  removeScenario: (id: string) => void
  clearScenarios: () => void

  // ── Historical data key (for per-constituency Catalonia) ──
  historicalKey: string | null
  setHistoricalKey: (key: string | null) => void

  // ── UI ──
  activeTab: string
  setActiveTab: (tab: string) => void
}

let scenarioCounter = 0

export const useStore = create<Store>((set, get) => ({
  electionType: 'spain',
  votes: { ...DEFAULT_SPAIN_VOTES },
  result: calculateElection('spain', DEFAULT_SPAIN_VOTES),
  scenarios: [],
  historicalKey: null,
  activeTab: 'simulator',

  setElectionType: (type) => {
    const votes = type === 'spain' ? { ...DEFAULT_SPAIN_VOTES } : { ...DEFAULT_CATALONIA_VOTES }
    const result = calculateElection(type, votes)
    set({ electionType: type, votes, result, historicalKey: null })
  },

  setVote: (partyId, pct) => {
    const votes = { ...get().votes, [partyId]: Math.max(0, Math.min(100, pct)) }
    set({ votes })
    // Debounced recalculation happens in recalculate()
    get().recalculate()
  },

  setVotes: (votes) => {
    set({ votes })
    get().recalculate()
  },

  recalculate: () => {
    const { electionType, votes, historicalKey } = get()
    const perConstituency = historicalKey
      ? CATALONIA_CONSTITUENCY_VOTES[historicalKey]
      : undefined
    const result = calculateElection(electionType, votes, perConstituency)
    set({ result })
  },

  saveScenario: (name) => {
    const { electionType, votes, result } = get()
    const scenario: Scenario = {
      id: `scenario-${++scenarioCounter}`,
      name,
      electionType,
      votes: { ...votes },
      result,
      createdAt: Date.now(),
    }
    set(s => ({ scenarios: [...s.scenarios.slice(-4), scenario] })) // keep max 5
  },

  removeScenario: (id) => {
    set(s => ({ scenarios: s.scenarios.filter(sc => sc.id !== id) }))
  },

  clearScenarios: () => set({ scenarios: [] }),

  setHistoricalKey: (key) => set({ historicalKey: key }),

  setActiveTab: (tab) => set({ activeTab: tab }),
}))
