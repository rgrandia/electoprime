import type { Constituency } from '@/lib/types'

// Spain Congress of Deputies — 350 seats total
// Seat counts based on 2023 election configuration
export const SPAIN_CONSTITUENCIES: Constituency[] = [
  // ── GALÍCIA ──
  { id: 'CO', name: 'A Coruña', seats: 9, electionType: 'spain', autonomia: 'Galícia', mapRow: 1, mapCol: 0 },
  { id: 'LU', name: 'Lugo', seats: 4, electionType: 'spain', autonomia: 'Galícia', mapRow: 1, mapCol: 1 },
  { id: 'OU', name: 'Ourense', seats: 4, electionType: 'spain', autonomia: 'Galícia', mapRow: 2, mapCol: 1 },
  { id: 'PO', name: 'Pontevedra', seats: 8, electionType: 'spain', autonomia: 'Galícia', mapRow: 2, mapCol: 0 },
  // ── ASTÚRIES ──
  { id: 'O', name: 'Astúries', seats: 8, electionType: 'spain', autonomia: 'Astúries', mapRow: 1, mapCol: 2 },
  // ── CANTÀBRIA ──
  { id: 'S', name: 'Cantàbria', seats: 5, electionType: 'spain', autonomia: 'Cantàbria', mapRow: 0, mapCol: 3 },
  // ── PAÍS BASC ──
  { id: 'BI', name: 'Biscaia', seats: 8, electionType: 'spain', autonomia: 'País Basc', mapRow: 0, mapCol: 4 },
  { id: 'SS', name: 'Guipúscoa', seats: 6, electionType: 'spain', autonomia: 'País Basc', mapRow: 0, mapCol: 5 },
  { id: 'VI', name: 'Àlaba', seats: 4, electionType: 'spain', autonomia: 'País Basc', mapRow: 1, mapCol: 4 },
  // ── NAVARRA ──
  { id: 'NA', name: 'Navarra', seats: 5, electionType: 'spain', autonomia: 'Navarra', mapRow: 0, mapCol: 6 },
  // ── LA RIOJA ──
  { id: 'LO', name: 'La Rioja', seats: 4, electionType: 'spain', autonomia: 'La Rioja', mapRow: 1, mapCol: 5 },
  // ── ARAGÓ ──
  { id: 'HU', name: 'Osca', seats: 3, electionType: 'spain', autonomia: 'Aragó', mapRow: 0, mapCol: 7 },
  { id: 'Z', name: 'Saragossa', seats: 7, electionType: 'spain', autonomia: 'Aragó', mapRow: 1, mapCol: 7 },
  { id: 'TE', name: 'Terol', seats: 3, electionType: 'spain', autonomia: 'Aragó', mapRow: 2, mapCol: 7 },
  // ── CATALUNYA ──
  { id: 'B', name: 'Barcelona', seats: 32, electionType: 'spain', autonomia: 'Catalunya', mapRow: 2, mapCol: 9 },
  { id: 'GI', name: 'Girona', seats: 6, electionType: 'spain', autonomia: 'Catalunya', mapRow: 1, mapCol: 9 },
  { id: 'LL', name: 'Lleida', seats: 4, electionType: 'spain', autonomia: 'Catalunya', mapRow: 2, mapCol: 8 },
  { id: 'TA', name: 'Tarragona', seats: 6, electionType: 'spain', autonomia: 'Catalunya', mapRow: 3, mapCol: 8 },
  // ── CASTELLA I LLEÓ ──
  { id: 'AV', name: 'Àvila', seats: 3, electionType: 'spain', autonomia: 'Castella i Lleó', mapRow: 3, mapCol: 3 },
  { id: 'BU', name: 'Burgos', seats: 4, electionType: 'spain', autonomia: 'Castella i Lleó', mapRow: 1, mapCol: 3 },
  { id: 'LE', name: 'Lleó', seats: 4, electionType: 'spain', autonomia: 'Castella i Lleó', mapRow: 2, mapCol: 2 },
  { id: 'P', name: 'Palència', seats: 3, electionType: 'spain', autonomia: 'Castella i Lleó', mapRow: 2, mapCol: 3 },
  { id: 'SA', name: 'Salamanca', seats: 4, electionType: 'spain', autonomia: 'Castella i Lleó', mapRow: 3, mapCol: 2 },
  { id: 'SG', name: 'Segòvia', seats: 3, electionType: 'spain', autonomia: 'Castella i Lleó', mapRow: 3, mapCol: 4 },
  { id: 'SO', name: 'Sòria', seats: 2, electionType: 'spain', autonomia: 'Castella i Lleó', mapRow: 2, mapCol: 6 },
  { id: 'VA', name: 'Valladolid', seats: 5, electionType: 'spain', autonomia: 'Castella i Lleó', mapRow: 2, mapCol: 4 },
  { id: 'ZA', name: 'Zamora', seats: 3, electionType: 'spain', autonomia: 'Castella i Lleó', mapRow: 3, mapCol: 1 },
  // ── MADRID ──
  { id: 'M', name: 'Madrid', seats: 37, electionType: 'spain', autonomia: 'Madrid', mapRow: 4, mapCol: 5 },
  // ── CASTELLA - LA MANXA ──
  { id: 'AB', name: 'Albacete', seats: 4, electionType: 'spain', autonomia: 'Cast.-La Manxa', mapRow: 5, mapCol: 7 },
  { id: 'CR', name: 'Ciudad Real', seats: 5, electionType: 'spain', autonomia: 'Cast.-La Manxa', mapRow: 5, mapCol: 6 },
  { id: 'CU', name: 'Conca', seats: 3, electionType: 'spain', autonomia: 'Cast.-La Manxa', mapRow: 4, mapCol: 7 },
  { id: 'GU', name: 'Guadalajara', seats: 3, electionType: 'spain', autonomia: 'Cast.-La Manxa', mapRow: 3, mapCol: 6 },
  { id: 'TO', name: 'Toledo', seats: 6, electionType: 'spain', autonomia: 'Cast.-La Manxa', mapRow: 5, mapCol: 5 },
  // ── EXTREMADURA ──
  { id: 'BA', name: 'Badajoz', seats: 6, electionType: 'spain', autonomia: 'Extremadura', mapRow: 6, mapCol: 3 },
  { id: 'CC', name: 'Càceres', seats: 4, electionType: 'spain', autonomia: 'Extremadura', mapRow: 5, mapCol: 3 },
  // ── COMUNITAT VALENCIANA ──
  { id: 'A', name: 'Alacant', seats: 12, electionType: 'spain', autonomia: 'C. Valenciana', mapRow: 6, mapCol: 8 },
  { id: 'CS', name: 'Castelló', seats: 5, electionType: 'spain', autonomia: 'C. Valenciana', mapRow: 4, mapCol: 8 },
  { id: 'V', name: 'València', seats: 16, electionType: 'spain', autonomia: 'C. Valenciana', mapRow: 5, mapCol: 8 },
  // ── MÚRCIA ──
  { id: 'MU', name: 'Múrcia', seats: 10, electionType: 'spain', autonomia: 'Múrcia', mapRow: 6, mapCol: 7 },
  // ── ANDALUSIA ──
  { id: 'AL', name: 'Almeria', seats: 6, electionType: 'spain', autonomia: 'Andalusia', mapRow: 7, mapCol: 7 },
  { id: 'CA', name: 'Cadis', seats: 9, electionType: 'spain', autonomia: 'Andalusia', mapRow: 8, mapCol: 4 },
  { id: 'CB', name: 'Còrdova', seats: 7, electionType: 'spain', autonomia: 'Andalusia', mapRow: 7, mapCol: 5 },
  { id: 'GR', name: 'Granada', seats: 8, electionType: 'spain', autonomia: 'Andalusia', mapRow: 7, mapCol: 6 },
  { id: 'H', name: 'Huelva', seats: 5, electionType: 'spain', autonomia: 'Andalusia', mapRow: 7, mapCol: 3 },
  { id: 'J', name: 'Jaén', seats: 5, electionType: 'spain', autonomia: 'Andalusia', mapRow: 7, mapCol: 4 },
  { id: 'MA', name: 'Màlaga', seats: 11, electionType: 'spain', autonomia: 'Andalusia', mapRow: 8, mapCol: 5 },
  { id: 'SE', name: 'Sevilla', seats: 12, electionType: 'spain', autonomia: 'Andalusia', mapRow: 7, mapCol: 2 },
  // ── ILLES BALEARS ──
  { id: 'IB', name: 'Illes Balears', seats: 8, electionType: 'spain', autonomia: 'Illes Balears', mapRow: 4, mapCol: 9 },
  // ── CANÀRIES ──
  { id: 'LP', name: 'Las Palmas', seats: 8, electionType: 'spain', autonomia: 'Canàries', mapRow: 9, mapCol: 1 },
  { id: 'TF', name: 'Santa Cruz de Tenerife', seats: 7, electionType: 'spain', autonomia: 'Canàries', mapRow: 9, mapCol: 0 },
  // ── CEUTA i MELILLA ──
  { id: 'CE', name: 'Ceuta', seats: 1, electionType: 'spain', autonomia: 'Ceuta', mapRow: 9, mapCol: 4 },
  { id: 'ML', name: 'Melilla', seats: 1, electionType: 'spain', autonomia: 'Melilla', mapRow: 9, mapCol: 5 },
]

// Parlament de Catalunya — 135 seats total
export const CATALONIA_CONSTITUENCIES: Constituency[] = [
  { id: 'BCN', name: 'Barcelona', seats: 85, electionType: 'catalonia' },
  { id: 'GIR', name: 'Girona', seats: 17, electionType: 'catalonia' },
  { id: 'LLE', name: 'Lleida', seats: 15, electionType: 'catalonia' },
  { id: 'TAR', name: 'Tarragona', seats: 18, electionType: 'catalonia' },
]

// Autonomous communities for the map (Spain)
export const AUTONOMOUS_COMMUNITIES = [
  { id: 'GAL', name: 'Galícia', provinces: ['CO', 'LU', 'OU', 'PO'], x: 30, y: 60, w: 85, h: 100 },
  { id: 'AST', name: 'Astúries', provinces: ['O'], x: 125, y: 40, w: 95, h: 60 },
  { id: 'CAN', name: 'Cantàbria', provinces: ['S'], x: 165, y: 100, w: 60, h: 40 },
  { id: 'PV', name: 'País Basc', provinces: ['BI', 'SS', 'VI'], x: 230, y: 40, w: 80, h: 75 },
  { id: 'NAV', name: 'Navarra', provinces: ['NA'], x: 310, y: 40, w: 65, h: 80 },
  { id: 'RIO', name: 'La Rioja', provinces: ['LO'], x: 270, y: 115, w: 60, h: 40 },
  { id: 'ARA', name: 'Aragó', provinces: ['HU', 'Z', 'TE'], x: 375, y: 40, w: 90, h: 155 },
  { id: 'CAT', name: 'Catalunya', provinces: ['B', 'GI', 'LL', 'TA'], x: 465, y: 30, w: 100, h: 155 },
  { id: 'CYL', name: 'Castella i Lleó', provinces: ['AV', 'BU', 'LE', 'P', 'SA', 'SG', 'SO', 'VA', 'ZA'], x: 120, y: 140, w: 250, h: 130 },
  { id: 'MAD', name: 'Madrid', provinces: ['M'], x: 235, y: 270, w: 70, h: 65 },
  { id: 'EXT', name: 'Extremadura', provinces: ['BA', 'CC'], x: 90, y: 270, w: 110, h: 120 },
  { id: 'CLM', name: 'Cast.-La Manxa', provinces: ['AB', 'CR', 'CU', 'GU', 'TO'], x: 235, y: 250, w: 180, h: 120 },
  { id: 'VAL', name: 'C. Valenciana', provinces: ['A', 'CS', 'V'], x: 465, y: 185, w: 75, h: 140 },
  { id: 'MUR', name: 'Múrcia', provinces: ['MU'], x: 415, y: 305, w: 90, h: 80 },
  { id: 'AND', name: 'Andalusia', provinces: ['AL', 'CA', 'CB', 'GR', 'H', 'J', 'MA', 'SE'], x: 90, y: 390, w: 420, h: 120 },
  { id: 'BAL', name: 'Illes Balears', provinces: ['IB'], x: 540, y: 305, w: 75, h: 65 },
  { id: 'CAN', name: 'Canàries', provinces: ['LP', 'TF'], x: 30, y: 475, w: 130, h: 65 },
]
