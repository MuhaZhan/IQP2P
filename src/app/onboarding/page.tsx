'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STEPS = [
  {
    id: 1,
    title: 'Добро пожаловать в Peer-to-Peer',
    text: `IQanat Peer-to-Peer — это система, где опытные участники помогают новичкам готовиться к олимпиаде.

Ты можешь быть:
• Peer Learner — ученик, который получает поддержку
• Peer Tutor — тьютор, который помогает младшим
• Куратор — выпускник, который координирует работу

Главный принцип: Giving Back — передавай дальше то, что получил.`,
  },
  {
    id: 2,
    title: 'Как проходят занятия',
    text: `Онлайн-уроки с тьютором проходят 2 раза в неделю через Google Meet.

Ссылка на урок находится в разделе «Online Lesson» в LMS.

Перед стартом курса ты проходишь входной тест — он помогает понять уровень знаний и подобрать подходящую программу.`,
  },
  {
    id: 3,
    title: 'Поинты и титулы',
    text: `За активность ты получаешь поинты:

• Прохождение квестов
• Победы в дуэлях
• Участие в играх

Поинты дают титулы и цвет имени. Лучшие участники получают право на личный чат 1-на-1 с тьютором.`,
  },
  {
    id: 4,
    title: 'Готов начать?',
    text: `Ты прошёл знакомство с системой.

За это ты получаешь +50 поинтов.

Теперь можешь:
— пройти детективный квест
— сыграть в дуэль
— заглянуть в лидерборд`,
    final: true,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) router.push('/login')
        else setUser(d.user)
      })
  }, [router])

  const current = STEPS[step]

  async function finish() {
    try {
      await fetch('/api/onboarding/complete', { method: 'POST' })
    } catch {}
    setDone(true)
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      finish()
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-[var(--muted)]">Загрузка...</div>
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative z-10">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-semibold mb-2">Онбординг пройден</h1>
        <p className="text-[var(--muted)] mb-6">+50 поинтов начислены</p>
        <Link href="/dashboard" className="btn-primary px-6 py-2.5">
          В кабинет
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b border-[var(--border)] px-4 h-14 flex items-center justify-between max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-sm text-[var(--muted)] hover:text-white">← Назад</Link>
        <span className="text-sm text-[var(--muted)]">Шаг {step + 1} / {STEPS.length}</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="card p-6">
          <h1 className="text-xl font-semibold mb-4">{current.title}</h1>
          <div className="text-[var(--text)] leading-relaxed whitespace-pre-line text-sm mb-8">
            {current.text}
          </div>
          <button onClick={next} className="btn-primary w-full py-2.5">
            {current.final ? 'Забрать +50 поинтов' : 'Далее →'}
          </button>
        </div>

        {/* progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition ${
                i <= step ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
