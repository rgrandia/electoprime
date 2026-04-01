import type { ElectionResult, ElectionType, SeatResult } from '@/lib/types'
import { PARTIES } from '@/lib/data/parties'
import { SPAIN_CONSTITUENCIES, CATALONIA_CONSTITUENCIES } from '@/lib/data/constituencies'

const SPAIN_TOTAL_SEATS = 350
const CATALONIA_TOTAL_SEATS = 135
const THRESHOLD = 0.03 // 3%

/**
 * Pure D'Hondt algorithm for a single constituency.
 * votes: Record<partyId, votePercentage (0-100)>
 * seats: number of seats to allocate
 * threshold: minimum percentage (0-1) to participate
 */
export function dHondt(
  votes: Record<string, number>,
  seats: number,
  threshold = THRESHOLD,
): Record<string, number> {
  const total = Object.values(votes).reduce((a, b) => a + b, 0)
  if (total === 0) return {}

  // Filter by threshold
  const eligible = Object.entries(votes).filter(
    ([, v]) => v / total >= threshold,
  )
  if (eligible.length === 0) return {}

  // Initialize quotients
  const seatCount: Record<string, number> = {}
  for (const [p] of eligible) seatCount[p] = 0

  // Assign seats one by one
  for (let i = 0; i < seats; i++) {
    let best = eligible[0][0]
    let bestQ = -Infinity
    for (const [p, v] of eligible) {
      const q = v / (seatCount[p] + 1)
      if (q > bestQ) { bestQ = q; best = p }
    }
    seatCount[best]++
  }

  return seatCount
}

/**
 * Get the vote percentage of a party in a specific constituency.
 * For regional parties, scales up their national % to regional %.
 * For state-wide parties, keeps national %.
 */
function getConstituencyVote(
  partyId: string,
  nationalPct: number,
  constituencyId: string,
  totalSeats: number,
): number | null {
  const party = PARTIES[partyId as keyof typeof PARTIES]
  if (!party) return nationalPct

  if (party.regionalOnly) {
    if (!party.regionalOnly.constituencies.includes(constituencyId)) return null
    // Scale up: national% = regional% × (homeSeats / totalSeats)
    const factor = totalSeats / party.regionalOnly.totalHomeSeats
    return nationalPct * factor
  }

  return nationalPct
}

/**
 * Calculate a full Spain Congress election.
 * Uses per-constituency D'Hondt with regional party scaling.
 */
export function calculateSpainElection(
  nationalVotes: Record<string, number>,
): ElectionResult {
  const byConstituency: SeatResult[] = []
  const totalSeats: Record<string, number> = {}

  for (const con of SPAIN_CONSTITUENCIES) {
    const constituencyVotes: Record<string, number> = {}

    for (const [partyId, nationalPct] of Object.entries(nationalVotes)) {
      const v = getConstituencyVote(partyId, nationalPct, con.id, SPAIN_TOTAL_SEATS)
      if (v !== null && v > 0) constituencyVotes[partyId] = v
    }

    const seats = dHondt(constituencyVotes, con.seats)
    byConstituency.push({ constituencyId: con.id, seats })

    for (const [p, s] of Object.entries(seats)) {
      totalSeats[p] = (totalSeats[p] ?? 0) + s
    }
  }

  return {
    totalSeats,
    byConstituency,
    totalVotes: nationalVotes,
    majorityNeeded: 176,
  }
}

/**
 * Calculate Catalan Parliament election.
 * Uses per-constituency D'Hondt with user-provided or proportional votes.
 */
export function calculateCataloniaElection(
  votes: Record<string, number>,
  perConstituencyVotes?: Record<string, Record<string, number>>,
): ElectionResult {
  const byConstituency: SeatResult[] = []
  const totalSeats: Record<string, number> = {}

  for (const con of CATALONIA_CONSTITUENCIES) {
    const conVotes = perConstituencyVotes?.[con.id] ?? votes
    const seats = dHondt(conVotes, con.seats)
    byConstituency.push({ constituencyId: con.id, seats })

    for (const [p, s] of Object.entries(seats)) {
      totalSeats[p] = (totalSeats[p] ?? 0) + s
    }
  }

  return {
    totalSeats,
    byConstituency,
    totalVotes: votes,
    majorityNeeded: 68,
  }
}

/**
 * Main entry point — dispatch to the right calculator.
 */
export function calculateElection(
  type: ElectionType,
  votes: Record<string, number>,
  perConstituencyVotes?: Record<string, Record<string, number>>,
): ElectionResult {
  if (type === 'spain') return calculateSpainElection(votes)
  return calculateCataloniaElection(votes, perConstituencyVotes)
}

/**
 * Find which party wins each autonomous community (Spain)
 * or demarcació (Catalonia) based on seat totals.
 */
export function getWinnerByRegion(
  result: ElectionResult,
  type: ElectionType,
): Record<string, string> {
  const winnerMap: Record<string, string> = {}
  const constituencies = type === 'spain' ? SPAIN_CONSTITUENCIES : CATALONIA_CONSTITUENCIES

  for (const byC of result.byConstituency) {
    const con = constituencies.find(c => c.id === byC.constituencyId)
    if (!con?.autonomia) continue

    const winner = Object.entries(byC.seats).sort((a, b) => b[1] - a[1])[0]
    if (!winner) continue

    const existing = winnerMap[con.autonomia]
    if (!existing) {
      winnerMap[con.autonomia] = winner[0]
    }
    // Note: In a more sophisticated version, we'd aggregate seats per autonomia
  }

  return winnerMap
}

/**
 * Calculate seat totals per autonomous community.
 */
export function getSeatsByAutonomia(result: ElectionResult): Record<string, Record<string, number>> {
  const autonomiaSeats: Record<string, Record<string, number>> = {}

  for (const byC of result.byConstituency) {
    const con = SPAIN_CONSTITUENCIES.find(c => c.id === byC.constituencyId)
    if (!con?.autonomia) continue

    if (!autonomiaSeats[con.autonomia]) autonomiaSeats[con.autonomia] = {}

    for (const [p, s] of Object.entries(byC.seats)) {
      autonomiaSeats[con.autonomia][p] = (autonomiaSeats[con.autonomia][p] ?? 0) + s
    }
  }

  return autonomiaSeats
}

/**
 * Normalize vote percentages to sum to 100.
 */
export function normalizeVotes(votes: Record<string, number>): Record<string, number> {
  const total = Object.values(votes).reduce((a, b) => a + b, 0)
  if (total === 0) return votes
  const result: Record<string, number> = {}
  for (const [k, v] of Object.entries(votes)) result[k] = (v / total) * 100
  return result
}
