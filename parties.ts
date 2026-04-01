import type { Party, PartyId } from '@/lib/types'

export const PARTIES: Record<PartyId, Party> = {
  // ──────── PARTITS ESTATAL-DRETA ────────
  PP: {
    id: 'PP',
    name: 'Partido Popular',
    shortName: 'PP',
    color: '#2563eb',
    textColor: '#fff',
    ideology: 0.65,
    elections: ['spain', 'catalonia'],
  },
  CS: {
    id: 'CS',
    name: 'Ciudadanos',
    shortName: 'Cs',
    color: '#f97316',
    textColor: '#fff',
    ideology: 0.40,
    elections: ['spain', 'catalonia'],
  },
  VOX: {
    id: 'VOX',
    name: 'Vox',
    shortName: 'Vox',
    color: '#15803d',
    textColor: '#fff',
    ideology: 0.90,
    elections: ['spain', 'catalonia'],
  },
  AC: {
    id: 'AC',
    name: 'Aliança Catalana',
    shortName: 'AC',
    color: '#be123c',
    textColor: '#fff',
    ideology: 0.75,
    elections: ['catalonia'],
  },

  // ──────── PARTITS ESTATAL-CENTRE/ESQUERRA ────────
  PSOE: {
    id: 'PSOE',
    name: 'Partido Socialista Obrero Español',
    shortName: 'PSOE',
    color: '#e11d48',
    textColor: '#fff',
    ideology: -0.20,
    elections: ['spain'],
  },
  PSC: {
    id: 'PSC',
    name: 'Partit dels Socialistes de Catalunya',
    shortName: 'PSC',
    color: '#ef4444',
    textColor: '#fff',
    ideology: -0.20,
    elections: ['catalonia'],
  },
  SUMAR: {
    id: 'SUMAR',
    name: 'Sumar',
    shortName: 'Sumar',
    color: '#7c3aed',
    textColor: '#fff',
    ideology: -0.60,
    elections: ['spain'],
  },
  ENCOMU: {
    id: 'ENCOMU',
    name: 'En Comú Podem',
    shortName: 'En Comú',
    color: '#a855f7',
    textColor: '#fff',
    ideology: -0.65,
    elections: ['catalonia'],
  },

  // ──────── PARTITS NACIONALISTES ────────
  ERC: {
    id: 'ERC',
    name: 'Esquerra Republicana de Catalunya',
    shortName: 'ERC',
    color: '#d97706',
    textColor: '#fff',
    ideology: -0.35,
    elections: ['spain', 'catalonia'],
    regionalOnly: {
      constituencies: ['B', 'GI', 'LL', 'TA'],
      totalHomeSeats: 48,
    },
  },
  JUNTS: {
    id: 'JUNTS',
    name: 'Junts per Catalunya',
    shortName: 'Junts',
    color: '#0ea5e9',
    textColor: '#fff',
    ideology: 0.25,
    elections: ['spain', 'catalonia'],
    regionalOnly: {
      constituencies: ['B', 'GI', 'LL', 'TA'],
      totalHomeSeats: 48,
    },
  },
  CUP: {
    id: 'CUP',
    name: "Candidatura d'Unitat Popular",
    shortName: 'CUP',
    color: '#eab308',
    textColor: '#000',
    ideology: -1.0,
    elections: ['catalonia'],
  },
  EHBILDU: {
    id: 'EHBILDU',
    name: 'EH Bildu',
    shortName: 'Bildu',
    color: '#84cc16',
    textColor: '#000',
    ideology: -0.80,
    elections: ['spain'],
    regionalOnly: {
      constituencies: ['BI', 'SS', 'VI', 'NA'],
      totalHomeSeats: 23,
    },
  },
  PNV: {
    id: 'PNV',
    name: 'Partido Nacionalista Vasco',
    shortName: 'PNV',
    color: '#16a34a',
    textColor: '#fff',
    ideology: 0.10,
    elections: ['spain'],
    regionalOnly: {
      constituencies: ['BI', 'SS', 'VI'],
      totalHomeSeats: 18,
    },
  },
  BNG: {
    id: 'BNG',
    name: 'Bloque Nacionalista Galego',
    shortName: 'BNG',
    color: '#6366f1',
    textColor: '#fff',
    ideology: -0.45,
    elections: ['spain'],
    regionalOnly: {
      constituencies: ['CO', 'LU', 'OU', 'PO'],
      totalHomeSeats: 25,
    },
  },
  CC: {
    id: 'CC',
    name: 'Coalición Canaria',
    shortName: 'CC',
    color: '#14b8a6',
    textColor: '#fff',
    ideology: 0.30,
    elections: ['spain'],
    regionalOnly: {
      constituencies: ['LP', 'TF'],
      totalHomeSeats: 15,
    },
  },

  // ──────── ALTRES ────────
  OTROS: {
    id: 'OTROS',
    name: 'Altres partits',
    shortName: 'Altres',
    color: '#64748b',
    textColor: '#fff',
    ideology: 0,
    elections: ['spain', 'catalonia'],
  },
}

export function getParty(id: string): Party | undefined {
  return PARTIES[id as PartyId]
}

export function getPartiesForElection(type: 'spain' | 'catalonia'): Party[] {
  return Object.values(PARTIES).filter(p => p.elections.includes(type))
}

export function sortByIdeology(parties: Party[]): Party[] {
  return [...parties].sort((a, b) => a.ideology - b.ideology)
}

// Default vote percentages for Spain
export const DEFAULT_SPAIN_VOTES: Record<string, number> = {
  PP: 30, PSOE: 29, VOX: 13, SUMAR: 13,
  ERC: 3, JUNTS: 2, EHBILDU: 2, PNV: 1.5,
  CC: 0.8, BNG: 0.7, CS: 0, OTROS: 5,
}

// Default vote percentages for Catalonia
export const DEFAULT_CATALONIA_VOTES: Record<string, number> = {
  PSC: 28, JUNTS: 18, ERC: 14, PP: 8,
  ENCOMU: 7, CUP: 5, VOX: 4, AC: 4, CS: 2, OTROS: 10,
}
