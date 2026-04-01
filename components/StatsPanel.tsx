'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, AlertTriangle, PieChart } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PARTIES } from '@/lib/data/parties'
import { sortedResults, totalVotePct } from '@/lib/utils'

export default function StatsPanel() {
  const { result, votes, electionType } = useStore()

  const sorted = useMemo(() => result ? sortedResults(result) : [], [result])
  const totalVotes = useMemo(() => totalVotePct(votes), [votes])

  // Calculate disproportionality (Gallagher index)
  const gallagherIndex = useMemo(() => {
    if (!result || totalVotes === 0) return 0
    const totalSeats = Object.values(result.totalSeats).reduce((a, b) => a + b, 0)
    if (totalSeats === 0) return 0

    let sumSqDiff = 0
    const allParties = Array.from(new Set([...Object.keys(result.totalVotes), ...Object.keys(result.totalSeats)]))
    for (const p of allParties) {
      const votePct = (result.totalVotes[p] ?? 0) / totalVotes * 100
      const seatPct = ((result.totalSeats[p] ?? 0) / totalSeats) * 100
      sumSqDiff += (votePct - seatPct) ** 2
    }
    return Math.sqrt(sumSqDiff / 2)
  }, [result, totalVotes])

  // Effective number of parties (Laakso-Taagepera index)
  const effectiveParties = useMemo(() => {
    if (!result) return { vote: 0, seat: 0 }
    const totalSeats = Object.values(result.totalSeats).reduce((a, b) => a + b, 0)
    if (totalVotes === 0 || totalSeats === 0) return { vote: 0, seat: 0 }

    let sumVote = 0
    let sumSeat = 0
    for (const [p, v] of Object.entries(result.totalVotes)) {
      const share = v / totalVotes
      if (share > 0) sumVote += share * share
    }
    for (const [p, s] of Object.entries(result.totalSeats)) {
      const share = s / totalSeats
      if (share > 0) sumSeat += share * share
    }

    return {
      vote: sumVote > 0 ? 1 / sumVote : 0,
      seat: sumSeat > 0 ? 1 / sumSeat : 0,
    }
  }, [result, totalVotes])

  // Vote-seat disparity per party
  const disparityData = useMemo(() => {
    if (!result || totalVotes === 0) return []
    const totalSeats = Object.values(result.totalSeats).reduce((a, b) => a + b, 0)
    if (totalSeats === 0) return []

    return sorted.map(([partyId, seats]) => {
      const votePct = (result.totalVotes[partyId] ?? 0) / totalVotes * 100
      const seatPct = (seats / totalSeats) * 100
      const disparity = seatPct - votePct
      return { partyId, votePct, seatPct, seats, disparity }
    })
  }, [result, sorted, totalVotes])

  const maxBar = Math.max(...disparityData.map(d => Math.max(d.votePct, d.seatPct)), 1)

  if (!result) return null

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={BarChart3}
          label="Índex Gallagher"
          value={gallagherIndex.toFixed(2)}
          sublabel="Desproporcionalitat"
          color={gallagherIndex < 5 ? '#22c55e' : gallagherIndex < 10 ? '#f59e0b' : '#ef4444'}
        />
        <MetricCard
          icon={PieChart}
          label="NEP (Vots)"
          value={effectiveParties.vote.toFixed(2)}
          sublabel="Partits efectius"
          color="#8b5cf6"
        />
        <MetricCard
          icon={PieChart}
          label="NEP (Escons)"
          value={effectiveParties.seat.toFixed(2)}
          sublabel="Partits efectius"
          color="#06b6d4"
        />
        <MetricCard
          icon={TrendingUp}
          label="Majoria"
          value={`${result.majorityNeeded}`}
          sublabel={`de ${Object.values(result.totalSeats).reduce((a, b) => a + b, 0)} escons`}
          color="#f59e0b"
        />
      </div>

      {/* Vote vs Seat percentage chart */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-ink-300 mb-1">Vots vs Escons (%)</h3>
        <p className="text-xs text-ink-500 mb-4">Comparació del percentatge de vot amb el percentatge d&apos;escons obtinguts</p>

        <div className="space-y-3">
          {disparityData.map(({ partyId, votePct, seatPct, seats, disparity }, i) => {
            const party = PARTIES[partyId as keyof typeof PARTIES]
            if (!party) return null

            return (
              <motion.div
                key={partyId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold w-14" style={{ color: party.color }}>{party.shortName}</span>
                  <div className="flex-1 space-y-0.5">
                    {/* Vote bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-500 w-10">Vots</span>
                      <div className="flex-1 h-3 bg-ink-800/50 rounded-sm overflow-hidden">
                        <motion.div
                          className="h-full rounded-sm opacity-50"
                          style={{ background: party.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(votePct / maxBar) * 100}%` }}
                          transition={{ delay: i * 0.03 }}
                        />
                      </div>
                      <span className="text-xs font-mono text-ink-400 w-12 text-right">{votePct.toFixed(1)}%</span>
                    </div>
                    {/* Seat bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-500 w-10">Escons</span>
                      <div className="flex-1 h-3 bg-ink-800/50 rounded-sm overflow-hidden">
                        <motion.div
                          className="h-full rounded-sm"
                          style={{ background: party.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${(seatPct / maxBar) * 100}%` }}
                          transition={{ delay: i * 0.03 + 0.05 }}
                        />
                      </div>
                      <span className="text-xs font-mono text-ink-300 w-12 text-right">{seatPct.toFixed(1)}%</span>
                    </div>
                  </div>
                  {/* Disparity */}
                  <div className={`w-16 text-right text-xs font-bold font-mono ${
                    disparity > 0 ? 'text-green-400' : disparity < 0 ? 'text-red-400' : 'text-ink-500'
                  }`}>
                    {disparity > 0 ? '+' : ''}{disparity.toFixed(1)}pp
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Explanation */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-sm font-semibold text-ink-300 mb-2">Què signifiquen aquestes dades?</h4>
        <div className="space-y-2 text-xs text-ink-400 leading-relaxed">
          <p>
            <strong className="text-ink-200">Índex de Gallagher:</strong> Mesura la desproporcionalitat entre vots i escons.
            Un valor baix ({`<`}5) indica un sistema proporcional, un valor alt ({`>`}10) indica alta desproporcionalitat.
          </p>
          <p>
            <strong className="text-ink-200">NEP (Nombre Efectiu de Partits):</strong> Mesura quants partits competeixen efectivament.
            Un NEP alt indica major fragmentació parlamentària.
          </p>
          <p>
            <strong className="text-ink-200">pp (punts percentuals):</strong> La diferència entre el % d&apos;escons i el % de vots.
            Valors positius indiquen sobrerepresentació, negatius infrarepresentació.
          </p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ComponentType<Record<string, unknown>>
  label: string
  value: string
  sublabel: string
  color: string
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={14} className="text-ink-300" />
        </div>
        <span className="text-xs font-medium text-ink-400">{label}</span>
      </div>
      <div className="text-2xl font-black font-mono" style={{ color }}>{value}</div>
      <span className="text-xs text-ink-500">{sublabel}</span>
    </div>
  )
}
