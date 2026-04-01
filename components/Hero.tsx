'use client'

import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Users, Map, History, Zap, Vote } from 'lucide-react'

const FEATURES = [
  { icon: Vote, title: 'Simulador D\'Hondt', desc: 'Calcula escons en temps real amb el sistema D\'Hondt' },
  { icon: Users, title: 'Constructor de Coalicions', desc: 'Explora pactes possibles i majories' },
  { icon: History, title: 'Dades Històriques', desc: 'Compara amb eleccions reals passades' },
  { icon: Map, title: 'Mapa Regional', desc: 'Visualitza resultats per circumscripció' },
  { icon: BarChart3, title: 'Estadístiques', desc: 'Analitza desproporcionalitat i vots malbaratats' },
  { icon: Zap, title: 'Escenaris', desc: 'Guarda i compara múltiples escenaris' },
]

const PARTY_COLORS = ['#2563eb', '#e11d48', '#15803d', '#7c3aed', '#d97706', '#0ea5e9', '#84cc16', '#f97316', '#14b8a6', '#a855f7']

interface HeroProps {
  onEnter: () => void
}

export default function Hero({ onEnter }: HeroProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {PARTY_COLORS.map((color, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4 + Math.random() * 8,
              height: 4 + Math.random() * 8,
              background: color,
              opacity: 0.15,
              left: `${10 + (i * 9)}%`,
              top: `${20 + (i * 6) % 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink-950/50 to-ink-950" />

      {/* Hero hemicycle background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg viewBox="0 0 800 400" className="w-full max-w-4xl">
          {Array.from({ length: 180 }).map((_, i) => {
            const row = Math.floor(i / 30)
            const col = i % 30
            const radius = 100 + row * 45
            const angle = Math.PI * (1 - col / 29)
            const x = 400 + radius * Math.cos(angle)
            const y = 380 - radius * Math.sin(angle)
            const color = PARTY_COLORS[i % PARTY_COLORS.length]
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={6}
                fill={color}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ delay: i * 0.01, duration: 0.5 }}
              />
            )
          })}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-gold-400 border border-gold-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-gold-400 pulse-dot" />
            Simulador Electoral Interactiu
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
            <span className="gradient-text">Electo</span>
            <span className="text-ink-100">prime</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-lg mx-auto text-lg text-ink-300 font-light leading-relaxed">
            Simula eleccions a Espanya i Catalunya amb el sistema D&apos;Hondt.
            Explora coalicions, compara escenaris i analitza resultats en temps real.
          </p>

          {/* CTA */}
          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-ink-950 font-bold text-lg shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-shadow"
          >
            Comença a simular
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl w-full"
        >
          {FEATURES.map((feat, i) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="glass rounded-xl p-4 text-left hover:border-gold-500/20 transition-colors cursor-default group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center group-hover:bg-gold-500/20 transition-colors">
                    <Icon size={16} className="text-gold-400" />
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-ink-100 mb-1">{feat.title}</h3>
                <p className="text-xs text-ink-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-ink-600 flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-ink-400" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
