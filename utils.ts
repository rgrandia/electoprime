import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ElectionResult, Coalition } from '@/lib/types'
import { PARTIES, sortByIdeology } from '@/lib/data/parties'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPct(n: number, decimals = 1): string {
  return n.toFixed(decimals) + '%'
}

export function formatSeats(n: number): string {
  return n.toString()
}

/** Total seats in the simulation */
export function totalSeats(result: ElectionResult): number {
  return Object.values(result.totalSeats).reduce((a, b) => a + b, 0)
}

/** Sum of votes entered by the user */
export function totalVotePct(votes: Record<string, number>): number {
  return Object.values(votes).reduce((a, b) => a + b, 0)
}

/** Get color for a party */
export function partyColor(partyId: string): string {
  return PARTIES[partyId as keyof typeof PARTIES]?.color ?? '#6b7280'
}

/** Sort result entries by seat count descending */
export function sortedResults(result: ElectionResult): Array<[string, number]> {
  return Object.entries(result.totalSeats)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
}

/** Order parties left-to-right for hemicycle */
export function hemicycleOrder(result: ElectionResult): Array<{ partyId: string; seats: number; color: string }> {
  const parties = Object.entries(result.totalSeats)
    .filter(([, s]) => s > 0)
    .map(([id, seats]) => ({ partyId: id, seats, color: partyColor(id) }))

  const withIdeology = parties.map(p => ({
    ...p,
    ideology: PARTIES[p.partyId as keyof typeof PARTIES]?.ideology ?? 0,
  }))

  return withIdeology.sort((a, b) => a.ideology - b.ideology)
}

/** Find possible majority coalitions */
export function findCoalitions(result: ElectionResult): Coalition[] {
  const majority = result.majorityNeeded
  const parties = sortedResults(result)

  const coalitions: Coalition[] = []

  // Single majority
  for (const [p, s] of parties) {
    if (s >= majority) {
      coalitions.push({ parties: [p], totalSeats: s, hasMajority: true, label: 'Majoria absoluta' })
    }
  }

  // Two-party coalitions (ideological proximity)
  const sorted = parties.map(([id]) => PARTIES[id as keyof typeof PARTIES]).filter(Boolean)
  sortByIdeology(sorted as any)

  for (let i = 0; i < parties.length; i++) {
    for (let j = i + 1; j < parties.length; j++) {
      const total = parties[i][1] + parties[j][1]
      if (total >= majority) {
        coalitions.push({
          parties: [parties[i][0], parties[j][0]],
          totalSeats: total,
          hasMajority: true,
          label: 'Coalició de 2',
        })
        break
      }
    }
  }

  // Three-party coalitions
  for (let i = 0; i < Math.min(parties.length, 6); i++) {
    for (let j = i + 1; j < Math.min(parties.length, 6); j++) {
      for (let k = j + 1; k < Math.min(parties.length, 6); k++) {
        const total = parties[i][1] + parties[j][1] + parties[k][1]
        if (total >= majority) {
          coalitions.push({
            parties: [parties[i][0], parties[j][0], parties[k][0]],
            totalSeats: total,
            hasMajority: true,
            label: 'Coalició de 3',
          })
        }
      }
    }
  }

  // Deduplicate and limit
  const seen = new Set<string>()
  return coalitions.filter(c => {
    const key = [...c.parties].sort().join('+')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, 8)
}

/** Hemicycle seat positions in SVG space */
export interface SeatPos {
  x: number
  y: number
  seatRadius: number
  partyId: string
  color: string
}

export function generateHemicyclePositions(
  result: ElectionResult,
  width = 760,
  height = 380,
): SeatPos[] {
  const cx = width / 2
  const cy = height - 10

  const orderedParties = hemicycleOrder(result)
  const N = orderedParties.reduce((a, b) => a + b.seats, 0)
  if (N === 0) return []

  // Determine optimal row count: rows ≈ ceil(sqrt(N / π))
  const INNER = height * 0.22
  const OUTER = height * 0.93

  let rows = Math.max(3, Math.ceil(Math.sqrt(N / Math.PI)))
  // Clamp rows to a range that gives reasonable seat sizes
  rows = Math.min(rows, 12)

  const rowStep = (OUTER - INNER) / rows
  const radii = Array.from({ length: rows }, (_, i) => INNER + (i + 0.5) * rowStep)
  const totalLen = radii.reduce((s, r) => s + r, 0)

  // Distribute seats proportionally to circumference
  const perRow = radii.map(r => Math.round((N * r) / totalLen))
  const diff = perRow.reduce((a, b) => a + b) - N
  if (diff > 0) for (let i = 0; i < diff; i++) perRow[i % rows]--
  if (diff < 0) for (let i = 0; i < -diff; i++) perRow[i % rows]++

  const seatRadius = rowStep * 0.36

  // Generate (row, indexInRow) positions as seat indices
  const positions: Array<{ x: number; y: number }> = []
  for (let row = 0; row < rows; row++) {
    const r = radii[row]
    const n = perRow[row]
    for (let i = 0; i < n; i++) {
      const angle = Math.PI * (1 - i / (n > 1 ? n - 1 : 1))
      positions.push({
        x: cx + r * Math.cos(angle),
        y: cy - r * Math.sin(angle),
      })
    }
  }

  // Assign parties left→right
  const result2: SeatPos[] = []
  let posIdx = 0
  for (const { partyId, seats, color } of orderedParties) {
    for (let s = 0; s < seats && posIdx < positions.length; s++, posIdx++) {
      result2.push({ ...positions[posIdx], seatRadius, partyId, color })
    }
  }

  return result2
}
