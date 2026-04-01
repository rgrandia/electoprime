'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { BarChart3, Vote, Map, History, Users, Layers, ChevronDown } from 'lucide-react'

const TABS = [
  { id: 'simulator', label: 'Simulador', icon: Vote },
  { id: 'coalitions', label: 'Coalicions', icon: Users },
  { id: 'historical', label: 'Històric', icon: History },
  { id: 'map', label: 'Mapa', icon: Map },
  { id: 'scenarios', label: 'Escenaris', icon: Layers },
  { id: 'stats', label: 'Estadístiques', icon: BarChart3 },
]

export default function Header() {
  const { activeTab, setActiveTab, electionType, setElectionType } = useStore()

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-300 flex items-center justify-center">
                <Vote size={18} className="text-ink-950" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="gradient-text">Electo</span>
                <span className="text-ink-100">prime</span>
              </span>
            </div>
          </div>

          {/* Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-gold-400 bg-gold-500/10'
                      : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/50'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg border border-gold-500/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Election type switcher */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={electionType}
                onChange={e => setElectionType(e.target.value as 'spain' | 'catalonia')}
                className="appearance-none bg-ink-800 border border-ink-700 text-ink-100 text-sm font-medium rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
              >
                <option value="spain">Espanya (Congrés)</option>
                <option value="catalonia">Catalunya (Parlament)</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex md:hidden items-center gap-1 pb-2 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-gold-400 bg-gold-500/10 border border-gold-500/30'
                    : 'text-ink-400 hover:text-ink-200'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
