import type { HistoricalElection } from '@/lib/types'

export const HISTORICAL_ELECTIONS: HistoricalElection[] = [
  // ──────── ESPANYA ────────
  {
    id: 'spain-2023',
    name: 'Espanya 23J 2023',
    date: '2023-07-23',
    electionType: 'spain',
    votes: {
      PP: 33.05, PSOE: 31.70, VOX: 12.39, SUMAR: 12.31,
      ERC: 2.97, JUNTS: 1.63, EHBILDU: 1.65, PNV: 1.04,
      CC: 0.64, BNG: 0.60, CS: 0, OTROS: 2.02,
    },
    actualSeats: {
      PP: 137, PSOE: 122, VOX: 33, SUMAR: 31,
      ERC: 7, JUNTS: 7, EHBILDU: 6, PNV: 5,
      CC: 1, BNG: 1,
    },
  },
  {
    id: 'spain-2019n',
    name: 'Espanya 10N 2019',
    date: '2019-11-10',
    electionType: 'spain',
    votes: {
      PP: 20.82, PSOE: 28.00, VOX: 15.09, SUMAR: 12.84,
      ERC: 3.61, JUNTS: 1.85, EHBILDU: 1.10, PNV: 1.56,
      CC: 0.54, BNG: 0.48, CS: 10.09, OTROS: 4.02,
    },
    actualSeats: {
      PP: 89, PSOE: 120, VOX: 52, SUMAR: 35,
      ERC: 13, JUNTS: 8, EHBILDU: 5, PNV: 6,
      CC: 2, BNG: 1, CS: 10,
    },
  },
  {
    id: 'spain-2019a',
    name: 'Espanya 28A 2019',
    date: '2019-04-28',
    electionType: 'spain',
    votes: {
      PP: 16.70, PSOE: 28.68, VOX: 10.26, SUMAR: 14.31,
      ERC: 3.88, JUNTS: 1.89, EHBILDU: 1.03, PNV: 1.56,
      CC: 0.44, BNG: 0.46, CS: 15.87, OTROS: 4.92,
    },
    actualSeats: {
      PP: 66, PSOE: 123, VOX: 24, SUMAR: 42,
      ERC: 15, JUNTS: 7, EHBILDU: 4, PNV: 6,
      CC: 2, BNG: 1, CS: 57,
    },
  },
  {
    id: 'spain-2016',
    name: 'Espanya 26J 2016',
    date: '2016-06-26',
    electionType: 'spain',
    votes: {
      PP: 33.01, PSOE: 22.63, SUMAR: 21.15,
      ERC: 2.64, JUNTS: 2.01, EHBILDU: 0.83, PNV: 1.19,
      CC: 0.32, BNG: 0.46, CS: 13.05, VOX: 0.20, OTROS: 2.51,
    },
    actualSeats: {
      PP: 137, PSOE: 85, SUMAR: 71,
      ERC: 9, JUNTS: 8, EHBILDU: 2, PNV: 5,
      CC: 1, BNG: 0, CS: 32,
    },
  },

  // ──────── CATALUNYA ────────
  {
    id: 'catalonia-2024',
    name: 'Catalunya 12M 2024',
    date: '2024-05-12',
    electionType: 'catalonia',
    votes: {
      PSC: 28.05, JUNTS: 17.38, ERC: 13.66, PP: 7.68,
      ENCOMU: 6.13, CUP: 4.41, VOX: 3.80, AC: 3.62,
      CS: 1.88, OTROS: 13.39,
    },
    actualSeats: {
      PSC: 42, JUNTS: 27, ERC: 20, PP: 8,
      ENCOMU: 6, CUP: 4, VOX: 3, AC: 2,
    },
  },
  {
    id: 'catalonia-2021',
    name: 'Catalunya 14F 2021',
    date: '2021-02-14',
    electionType: 'catalonia',
    votes: {
      PSC: 23.03, ERC: 21.30, JUNTS: 20.07, VOX: 7.67,
      ENCOMU: 7.45, CS: 5.55, CUP: 6.68, PP: 3.85, OTROS: 4.40,
    },
    actualSeats: {
      PSC: 33, ERC: 33, JUNTS: 32, VOX: 11,
      ENCOMU: 8, CS: 6, CUP: 9, PP: 3,
    },
  },
  {
    id: 'catalonia-2017',
    name: 'Catalunya 21D 2017',
    date: '2017-12-21',
    electionType: 'catalonia',
    votes: {
      CS: 25.35, JUNTS: 21.65, ERC: 21.39, PSC: 13.89,
      ENCOMU: 7.45, CUP: 4.46, PP: 4.24, VOX: 0, AC: 0, OTROS: 1.57,
    },
    actualSeats: {
      CS: 36, JUNTS: 34, ERC: 32, PSC: 17,
      ENCOMU: 8, CUP: 4, PP: 4,
    },
  },
]

// Per-constituency historical data for Catalonia
// Approximate percentages per demarcació
export const CATALONIA_CONSTITUENCY_VOTES: Record<string, Record<string, Record<string, number>>> = {
  'catalonia-2024': {
    BCN: { PSC: 31.5, JUNTS: 15.8, ERC: 12.5, PP: 8.5, ENCOMU: 7.2, CUP: 3.8, VOX: 4.2, AC: 2.8, CS: 2.1, OTROS: 11.6 },
    GIR: { PSC: 22.0, JUNTS: 23.5, ERC: 17.8, PP: 6.0, ENCOMU: 4.2, CUP: 5.8, VOX: 2.8, AC: 6.2, CS: 1.2, OTROS: 10.5 },
    LLE: { PSC: 22.5, JUNTS: 20.5, ERC: 17.2, PP: 6.5, ENCOMU: 4.5, CUP: 5.5, VOX: 3.2, AC: 5.8, CS: 1.5, OTROS: 12.8 },
    TAR: { PSC: 26.0, JUNTS: 16.5, ERC: 13.8, PP: 8.8, ENCOMU: 6.0, CUP: 4.2, VOX: 4.5, AC: 3.2, CS: 2.0, OTROS: 15.0 },
  },
  'catalonia-2021': {
    BCN: { PSC: 25.5, ERC: 20.8, JUNTS: 18.2, VOX: 8.2, ENCOMU: 9.0, CS: 6.0, CUP: 5.8, PP: 4.2, OTROS: 2.3 },
    GIR: { PSC: 18.5, ERC: 24.5, JUNTS: 26.8, VOX: 6.5, ENCOMU: 4.8, CS: 4.5, CUP: 8.8, PP: 3.0, OTROS: 2.6 },
    LLE: { PSC: 19.2, ERC: 23.5, JUNTS: 25.2, VOX: 6.8, ENCOMU: 4.5, CS: 4.8, CUP: 8.5, PP: 3.5, OTROS: 4.0 },
    TAR: { PSC: 24.8, ERC: 20.2, JUNTS: 19.5, VOX: 8.8, ENCOMU: 6.8, CS: 5.5, CUP: 6.2, PP: 4.2, OTROS: 4.0 },
  },
}
