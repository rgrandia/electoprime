'use client'

import VoteSliders from '@/components/VoteSliders'
import Hemicycle from '@/components/Hemicycle'
import { useStore } from '@/lib/store'

export default function Page() {
  const { result, electionType } = useStore()

  if (!result) return null

  return (
    <main className="min-h-screen bg-ink-950 p-6">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[420px_1fr]">
        <section className="rounded-xl border border-ink-800 bg-ink-900 p-4">
          <VoteSliders />
        </section>
        <section className="rounded-xl border border-ink-800 bg-ink-900 p-4">
          <Hemicycle result={result} electionType={electionType} />
        </section>
      </div>
    </main>
  )
}
