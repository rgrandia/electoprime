'use client'

import { useMemo, useState } from 'react'
import type { ElectionResult } from '@/lib/types'
import { generateHemicyclePositions, sortedResults, partyColor } from '@/lib/utils'
import { PARTIES } from '@/lib/data/parties'

interface HemicycleProps {
  result: ElectionResult
  electionType: 'spain' | 'catalonia'
}

export default function Hemicycle({ result, electionType }: HemicycleProps) {
  const [hoveredParty, setHoveredParty] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; partyId: string } | null>(null)

  const W = 760
  const H = 380
  const seats = useMemo(() => generateHemicyclePositions(result, W, H), [result])
  const majority = result.majorityNeeded
  const topResults = useMemo(() => sortedResults(result).slice(0, 10), [result])

  // Majority indicator arc
  const totalN = seats.length
  const majorityAngle = totalN > 0 ? (majority / totalN) * Math.PI : Math.PI / 2

  return (
    <div className="relative w-full">
      {/* Main SVG */}
      <svg
        viewBox={`0 0 ${W} ${H + 10}`}
        className="w-full"
        style={{ maxHeight: 380 }}
        aria-label="Hemicicle electoral"
      >
        <defs>
          {/* Glow filters per party */}
          {topResults.map(([id]) => (
            <filter key={id} id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
          <filter id="glow-default" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Dark radial gradient for background arc */}
          <radialGradient id="hemiBg" cx="50%" cy="100%" r="95%">
            <stop offset="0%" stopColor="#0d1a33" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06090f" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background arc fill */}
        <ellipse cx={W / 2} cy={H - 5} rx={H * 0.93} ry={H * 0.93} fill="url(#hemiBg)" />

        {/* Majority line */}
        {totalN > 0 && (() => {
          const cx = W / 2
          const cy = H - 10
          // Middle radius
          const midR = H * 0.57
          const angle = Math.PI * 0.5 // 50% = straight up
          const lineLen = H * 0.85
          return (
            <g>
              <line
                x1={cx}
                y1={cy}
                x2={cx}
                y2={cy - lineLen}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="5,4"
                opacity="0.5"
              />
              <text
                x={cx + 6}
                y={cy - lineLen + 14}
                fill="#f59e0b"
                fontSize="10"
                fontFamily="var(--font-mono)"
                opacity="0.8"
              >
                {majority} (majoria)
              </text>
            </g>
          )
        })()}

        {/* Seats */}
        {seats.map((seat, i) => {
          const isHovered = hoveredParty === seat.partyId
          const isDimmed = hoveredParty && !isHovered
          const r = seat.seatRadius
          return (
            <circle
              key={i}
              cx={seat.x}
              cy={seat.y}
              r={isDimmed ? r * 0.8 : isHovered ? r * 1.15 : r}
              fill={seat.color}
              opacity={isDimmed ? 0.25 : 0.92}
              filter={isHovered ? `url(#glow-${seat.partyId})` : undefined}
              style={{
                transition: 'r 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease, cx 0.6s ease, cy 0.6s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                setHoveredParty(seat.partyId)
                setTooltip({ x: seat.x, y: seat.y, partyId: seat.partyId })
              }}
              onMouseLeave={() => {
                setHoveredParty(null)
                setTooltip(null)
              }}
            />
          )
        })}

        {/* Center label — total seats */}
        <text
          x={W / 2}
          y={H - 18}
          textAnchor="middle"
          fill="#94a3b8"
          fontSize="12"
          fontFamily="var(--font-mono)"
        >
          {totalN} escons
        </text>

        {/* Tooltip (SVG-based) */}
        {tooltip && (() => {
          const party = PARTIES[tooltip.partyId as keyof typeof PARTIES]
          const seats = result.totalSeats[tooltip.partyId] ?? 0
          const pct = result.totalVotes[tooltip.partyId] ?? 0
          if (!party) return null

          const tx = Math.min(Math.max(tooltip.x, 70), W - 70)
          const ty = Math.max(tooltip.y - 50, 10)

          return (
            <g>
              <rect
                x={tx - 60} y={ty - 4}
                width={120} height={46}
                rx={6} ry={6}
                fill="#0d1420"
                stroke={party.color}
                strokeWidth={1.5}
                opacity={0.97}
              />
              <text x={tx} y={ty + 14} textAnchor="middle" fill={party.color} fontSize="12" fontWeight="700" fontFamily="var(--font-body)">
                {party.shortName}
              </text>
              <text x={tx} y={ty + 28} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="var(--font-mono)">
                {seats} escons · {pct.toFixed(1)}%
              </text>
            </g>
          )
        })()}
      </svg>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 justify-center px-2">
        {topResults.map(([partyId, seatCount]) => {
          const party = PARTIES[partyId as keyof typeof PARTIES]
          if (!party || seatCount === 0) return null
          const pct = result.totalVotes[partyId] ?? 0
          const isHov = hoveredParty === partyId

          return (
            <button
              key={partyId}
              onMouseEnter={() => setHoveredParty(partyId)}
              onMouseLeave={() => setHoveredParty(null)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-all"
              style={{
                background: isHov ? `${party.color}22` : 'transparent',
                border: `1px solid ${isHov ? party.color : 'transparent'}`,
              }}
            >
              <span
                className="inline-block rounded-full flex-shrink-0"
                style={{ width: 10, height: 10, background: party.color }}
              />
              <span className="text-xs font-body font-medium text-ink-300">
                {party.shortName}
              </span>
              <span
                className="text-xs font-mono font-bold"
                style={{ color: party.color }}
              >
                {seatCount}
              </span>
              <span className="text-xs text-ink-400 font-mono">
                ({pct.toFixed(1)}%)
              </span>
            </button>
          )
        })}
      </div>

      {/* Majority status banner */}
      <MajorityBanner result={result} />
    </div>
  )
}

function MajorityBanner({ result }: { result: ElectionResult }) {
  const sorted = sortedResults(result)
  const leader = sorted[0]
  if (!leader) return null

  const [partyId, seats] = leader
  const party = PARTIES[partyId as keyof typeof PARTIES]
  const majority = result.majorityNeeded
  const hasMaj = seats >= majority
  const diff = seats - majority

  return (
    <div
      className="mt-4 mx-auto max-w-sm rounded-xl px-4 py-2.5 text-center text-sm"
      style={{
        background: hasMaj
          ? `${party?.color ?? '#16a34a'}20`
          : '#1e293b',
        border: `1px solid ${hasMaj ? (party?.color ?? '#16a34a') + '55' : '#334155'}`,
      }}
    >
      {hasMaj ? (
        <span style={{ color: party?.color }} className="font-semibold">
          {party?.shortName} té majoria absoluta
          <span className="text-ink-300 font-normal"> (+{diff} escons de marge)</span>
        </span>
      ) : (
        <span className="text-ink-300">
          <span style={{ color: party?.color }} className="font-semibold">{party?.shortName} </span>
          és el partit més votat però{' '}
          <span className="text-gold-400 font-semibold">no té majoria</span>
          {' '}(li falten {-diff} escons)
        </span>
      )}
    </div>
  )
}
