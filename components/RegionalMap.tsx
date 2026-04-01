'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { PARTIES } from '@/lib/data/parties'
import { AUTONOMOUS_COMMUNITIES, CATALONIA_CONSTITUENCIES } from '@/lib/data/constituencies'
import { getSeatsByAutonomia } from '@/lib/dhondt'

export default function RegionalMap() {
  const { result, electionType } = useStore()
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  const regionData = useMemo(() => {
    if (!result) return {}
    if (electionType === 'spain') {
      return getSeatsByAutonomia(result)
    }
    // Catalonia: use byConstituency directly
    const data: Record<string, Record<string, number>> = {}
    for (const bc of result.byConstituency) {
      const con = CATALONIA_CONSTITUENCIES.find(c => c.id === bc.constituencyId)
      if (con) data[con.name] = bc.seats
    }
    return data
  }, [result, electionType])

  const getRegionWinner = (regionSeats: Record<string, number>): string | null => {
    const entries = Object.entries(regionSeats)
    if (entries.length === 0) return null
    entries.sort((a, b) => b[1] - a[1])
    return entries[0][0]
  }

  const regions = electionType === 'spain'
    ? AUTONOMOUS_COMMUNITIES
    : CATALONIA_CONSTITUENCIES.map((c, i) => ({
        id: c.id,
        name: c.name,
        provinces: [c.id],
        x: 50 + i * 140,
        y: 100,
        w: 120,
        h: 120,
      }))

  if (!result) return null

  // Map dimensions
  const mapW = electionType === 'spain' ? 650 : 600
  const mapH = electionType === 'spain' ? 560 : 300

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-ink-300">
        {electionType === 'spain' ? 'Mapa per comunitats autònomes' : 'Mapa per circumscripcions'}
      </h3>

      {/* Map */}
      <div className="glass rounded-xl p-4 overflow-auto">
        <svg
          viewBox={`0 0 ${mapW} ${mapH}`}
          className="w-full"
          style={{ maxHeight: electionType === 'spain' ? 500 : 280 }}
        >
          {regions.map((region, idx) => {
            const regionName = region.name
            const seats = regionData[regionName]
            const winner = seats ? getRegionWinner(seats) : null
            const party = winner ? PARTIES[winner as keyof typeof PARTIES] : null
            const color = party?.color ?? '#334155'
            const isHovered = hoveredRegion === regionName
            const totalRegionSeats = seats ? Object.values(seats).reduce((a, b) => a + b, 0) : 0

            return (
              <g key={region.id + idx}>
                <motion.rect
                  x={region.x}
                  y={region.y}
                  width={region.w}
                  height={region.h}
                  rx={6}
                  fill={color}
                  fillOpacity={isHovered ? 0.5 : 0.25}
                  stroke={isHovered ? color : '#334155'}
                  strokeWidth={isHovered ? 2 : 1}
                  onMouseEnter={() => setHoveredRegion(regionName)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                />
                <text
                  x={region.x + region.w / 2}
                  y={region.y + region.h / 2 - 6}
                  textAnchor="middle"
                  fill={isHovered ? '#fff' : '#94a3b8'}
                  fontSize={region.w < 70 ? 7 : 9}
                  fontWeight="600"
                  pointerEvents="none"
                >
                  {region.name.length > 14 ? region.name.slice(0, 12) + '...' : region.name}
                </text>
                {winner && (
                  <text
                    x={region.x + region.w / 2}
                    y={region.y + region.h / 2 + 8}
                    textAnchor="middle"
                    fill={color}
                    fontSize={region.w < 70 ? 7 : 10}
                    fontWeight="800"
                    pointerEvents="none"
                  >
                    {party?.shortName}
                  </text>
                )}
                {totalRegionSeats > 0 && (
                  <text
                    x={region.x + region.w / 2}
                    y={region.y + region.h / 2 + 20}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize={7}
                    fontFamily="monospace"
                    pointerEvents="none"
                  >
                    {totalRegionSeats} escons
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Region details tooltip */}
      {hoveredRegion && regionData[hoveredRegion] && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          <h4 className="text-sm font-bold text-ink-100 mb-3">{hoveredRegion}</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.entries(regionData[hoveredRegion])
              .sort((a, b) => b[1] - a[1])
              .map(([partyId, seats]) => {
                const party = PARTIES[partyId as keyof typeof PARTIES]
                if (!party || seats === 0) return null
                return (
                  <div
                    key={partyId}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                    style={{ background: `${party.color}15` }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: party.color }} />
                    <span className="text-xs font-bold" style={{ color: party.color }}>{party.shortName}</span>
                    <span className="text-xs font-mono text-ink-300 ml-auto">{seats}</span>
                  </div>
                )
              })}
          </div>
        </motion.div>
      )}

      {/* Region summary table */}
      <div className="glass rounded-xl p-4 overflow-auto">
        <h4 className="text-sm font-semibold text-ink-300 mb-3">Resum per regions</h4>
        <div className="space-y-1.5">
          {Object.entries(regionData)
            .sort((a, b) => {
              const totalA = Object.values(a[1]).reduce((s, v) => s + v, 0)
              const totalB = Object.values(b[1]).reduce((s, v) => s + v, 0)
              return totalB - totalA
            })
            .map(([name, seats]) => {
              const total = Object.values(seats).reduce((s, v) => s + v, 0)
              const winner = getRegionWinner(seats)
              const party = winner ? PARTIES[winner as keyof typeof PARTIES] : null
              const entries = Object.entries(seats).sort((a, b) => b[1] - a[1])

              return (
                <div
                  key={name}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-ink-800/50 transition-colors"
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: party?.color ?? '#334155' }} />
                  <span className="text-xs font-medium text-ink-200 w-32 flex-shrink-0 truncate">{name}</span>
                  <div className="flex-1 h-4 bg-ink-800/50 rounded-sm overflow-hidden flex">
                    {entries.map(([pid, s]) => {
                      const p = PARTIES[pid as keyof typeof PARTIES]
                      if (!p || s === 0) return null
                      return (
                        <div
                          key={pid}
                          className="h-full"
                          style={{ width: `${(s / total) * 100}%`, background: p.color }}
                          title={`${p.shortName}: ${s}`}
                        />
                      )
                    })}
                  </div>
                  <span className="text-xs font-mono text-ink-400 w-8 text-right flex-shrink-0">{total}</span>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
