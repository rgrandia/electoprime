export type ElectionType = 'spain' | 'catalonia'

export type PartyId =
  | 'PP' | 'PSOE' | 'VOX' | 'SUMAR' | 'ERC' | 'JUNTS'
  | 'EHBILDU' | 'PNV' | 'CC' | 'BNG' | 'CS'
  | 'PSC' | 'CUP' | 'ENCOMU' | 'AC'
  | 'OTROS'

export interface Party {
  id: PartyId
  name: string
  shortName: string
  color: string
  textColor: string
  ideology: number // -1 (far left) to 1 (far right)
  elections: ElectionType[]
  regionalOnly?: {
    constituencies: string[]
    totalHomeSeats: number
  }
}

export interface Constituency {
  id: string
  name: string
  seats: number
  electionType: ElectionType
  autonomia?: string
  // For cartogram map: approximate grid position
  mapRow?: number
  mapCol?: number
}

export interface SeatResult {
  constituencyId: string
  seats: Record<string, number>
}

export interface ElectionResult {
  totalSeats: Record<string, number>
  byConstituency: SeatResult[]
  totalVotes: Record<string, number>
  majorityNeeded: number
}

export interface Scenario {
  id: string
  name: string
  electionType: ElectionType
  votes: Record<string, number>
  result: ElectionResult | null
  createdAt: number
}

export interface HistoricalElection {
  id: string
  name: string
  date: string
  electionType: ElectionType
  votes: Record<string, number>
  actualSeats?: Record<string, number>
}

export interface Coalition {
  parties: string[]
  totalSeats: number
  hasMajority: boolean
  label: string
}
