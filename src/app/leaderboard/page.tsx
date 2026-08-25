'use client'

import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type User = {
  id: string
  name: string
  points: number
  title: string
  textColor: string
  role: string
  region?: string
}

const titleLabels: Record<string, string> = {
  NOVICE: 'Новичок',
  LEARNER: 'Ученик',
  DETECTIVE: 'Детектив',
  MENTOR: 'Наставник',
  MASTER: 'Мастер',
  LEGEND: 'Легенда',
}

const scopes = [
  { key: 'students', label: 'Учеников' },
  { key: 'tutors', label: 'Тьюторов' },
  { key: 'all', label: 'Общий' },
]

function LeaderboardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentScope = useMemo(() => (searchParams.get('scope') || 'students').toLowerCase(), [searchParams])

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/leaderboard?scope=${currentScope}`)
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []))
      .finally(() => setLoading(false))
  }, [currentScope])

  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b border-white/10 bg-[#081912]/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-18 flex items-center justify-between">
          <Link href="/dashboard" className="btn-ghost px-3 py-2 text-xs uppercase tracking-[0.16em]">Назад</Link>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8]">Лидерборд</div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-4 md:p-5 mb-5">
          <div className="flex flex-wrap gap-2">
            {scopes.map((scope) => (
              <button
                key={scope.key}
                onClick={() => router.replace(`/leaderboard?scope=${scope.key}`)}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  currentScope === scope.key
                    ? 'bg-[#6fe3a4] text-[#07130f] border-[#6fe3a4]'
                    : 'border-white/10 text-[#dfece4] bg-transparent'
                }`}
              >
                {scope.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card p-3 md:p-4">
          {loading ? (
            <div className="text-sm text-[#a9c7b8] p-5">Загрузка рейтинга...</div>
          ) : users.length === 0 ? (
            <div className="text-sm text-[#a9c7b8] p-5">Пока нет участников в этом рейтинге.</div>
          ) : (
            <div className="space-y-2">
              {users.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0d1b18] p-3 md:p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      index === 0 ? 'bg-[#f1c86b] text-[#07130f]' :
                      index === 1 ? 'bg-[#dfece4] text-[#07130f]' :
                      index === 2 ? 'bg-[#6fe3a4] text-[#07130f]' :
                      'bg-[#11251e] text-[#a9c7b8]'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate" style={{ color: user.textColor }}>{user.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.16em] text-[#a9c7b8]">
                        {titleLabels[user.title] || user.title}
                        {user.role ? ` · ${user.role}` : ''}
                        {user.region ? ` · ${user.region}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-black tracking-[-0.06em] text-[#6fe3a4]">{user.points}</div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#a9c7b8]">points</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#a9c7b8]">Загрузка лидерборда...</div>}>
      <LeaderboardClient />
    </Suspense>
  )
}
