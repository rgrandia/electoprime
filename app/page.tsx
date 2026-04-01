'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from '@/components/Hero'
import Header from '@/components/Header'
import VoteSliders from '@/components/VoteSliders'
import Hemicycle from '@/components/Hemicycle'
import ResultsPanel from '@/components/ResultsPanel'
import CoalitionBuilder from '@/components/CoalitionBuilder'
import HistoricalComparison from '@/components/HistoricalComparison'
import RegionalMap from '@/components/RegionalMap'
import ScenarioManager from '@/components/ScenarioManager'
import StatsPanel from '@/components/StatsPanel'
import { useStore } from '@/lib/store'

export default function Page() {
  const { result, electionType, activeTab } = useStore()
  const [showHero, setShowHero] = useState(true)

  if (showHero) {
    return <Hero onEnter={() => setShowHero(false)} />
  }

  if (!result) return null

  return (
    <div className="min-h-screen bg-ink-950">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                {/* Left panel - Vote sliders */}
                <section className="glass rounded-xl p-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                  <VoteSliders />
                </section>

                {/* Right panel - Hemicycle + Results */}
                <div className="space-y-6">
                  <section className="glass rounded-xl p-4">
                    <Hemicycle result={result} electionType={electionType} />
                  </section>
                  <ResultsPanel />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'coalitions' && (
            <motion.div
              key="coalitions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <section className="glass rounded-xl p-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                  <VoteSliders />
                </section>
                <div className="space-y-6">
                  <section className="glass rounded-xl p-4">
                    <Hemicycle result={result} electionType={electionType} />
                  </section>
                  <CoalitionBuilder />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'historical' && (
            <motion.div
              key="historical"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <section className="glass rounded-xl p-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                  <VoteSliders />
                </section>
                <HistoricalComparison />
              </div>
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <section className="glass rounded-xl p-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                  <VoteSliders />
                </section>
                <RegionalMap />
              </div>
            </motion.div>
          )}

          {activeTab === 'scenarios' && (
            <motion.div
              key="scenarios"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <section className="glass rounded-xl p-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                  <VoteSliders />
                </section>
                <ScenarioManager />
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                <section className="glass rounded-xl p-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                  <VoteSliders />
                </section>
                <StatsPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-800/50 mt-12">
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-ink-500">
            <span className="gradient-text font-bold">Electoprime</span>
            <span>·</span>
            <span>Simulador Electoral</span>
          </div>
          <p className="text-xs text-ink-600">
            Sistema D&apos;Hondt · Dades orientatives
          </p>
        </div>
      </footer>
    </div>
  )
}
