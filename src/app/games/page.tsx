'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DECK = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function GamesPage() {
  const router = useRouter()
  const [cards, setCards] = useState<{ id: number; value: string; flipped: boolean; matched: boolean }[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((d) => {
      if (!d.user) router.push('/login')
    })
  }, [router])

  function start() {
    const deck = shuffle([...DECK, ...DECK]).map((value, id) => ({
      id,
      value,
      flipped: false,
      matched: false,
    }))
    setCards(deck)
    setFlipped([])
    setMoves(0)
    setWon(false)
    setStarted(true)
  }

  function flip(id: number) {
    if (flipped.length >= 2 || cards[id].flipped || cards[id].matched) return

    const next = cards.map((card) => (card.id === id ? { ...card, flipped: true } : card))
    setCards(next)
    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1)
      const [a, b] = newFlipped
      if (next[a].value === next[b].value) {
        setTimeout(() => {
          setCards((current) => current.map((card) =>
            card.id === a || card.id === b ? { ...card, matched: true } : card
          ))
          setFlipped([])
          const complete = next.every((card) => card.matched || card.id === a || card.id === b)
          if (complete) {
            setWon(true)
            fetch('/api/duels/complete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ score: 8, points: 20 }),
            }).catch(() => {})
          }
        }, 400)
      } else {
        setTimeout(() => {
          setCards((current) => current.map((card) =>
            card.id === a || card.id === b ? { ...card, flipped: false } : card
          ))
          setFlipped([])
        }, 700)
      }
    }
  }

  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b border-white/10 bg-[#081912]/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-18 flex items-center justify-between">
          <Link href="/dashboard" className="btn-ghost px-3 py-2 text-xs uppercase tracking-[0.16em]">Назад</Link>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8]">Мини-игра</div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="card p-6 md:p-8">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8] mb-3">Память</div>
          <h1 className="text-3xl font-black tracking-[-0.06em] text-white">Игра на память</h1>
          <p className="mt-3 text-[#cfe4d7] leading-7">Найди все пары и получи дополнительный бонус в поинтах.</p>

          {!started ? (
            <div className="mt-8 text-center">
              <button onClick={start} className="btn-primary px-8 py-3 text-sm md:text-base">Начать</button>
            </div>
          ) : (
            <>
              <div className="mt-6 text-sm text-[#a9c7b8] text-center">Ходы: {moves}</div>
              <div className="mt-5 grid grid-cols-4 gap-3">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => flip(card.id)}
                    className={`aspect-square rounded-2xl font-black text-2xl border transition ${
                      card.flipped || card.matched
                        ? 'bg-[#123827] border-[#6fe3a4] text-white'
                        : 'border-white/10 bg-[#0d1b18] text-[#a9c7b8]'
                    }`}
                  >
                    {card.flipped || card.matched ? card.value : '•'}
                  </button>
                ))}
              </div>

              {won && (
                <div className="mt-8 text-center">
                  <p className="text-2xl font-black tracking-[-0.06em] text-[#6fe3a4]">Победа</p>
                  <p className="mt-2 text-[#dfece4]">+20 поинтов</p>
                  <div className="mt-6 flex justify-center gap-3">
                    <button onClick={start} className="btn-ghost px-5 py-3 text-sm">Ещё раз</button>
                    <Link href="/dashboard" className="btn-primary px-5 py-3 text-sm">В кабинет</Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
