'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { titleLabels, roleLabels } from '@/lib/labels'

type User = {
  id: string
  name: string
  email: string
  role: string
  points: number
  title: string
  textColor: string
  region?: string
  groupId?: string
  group?: {
    id: string
    number: number
    name?: string
    telegramLink?: string
    subject?: string
    tutor?: { id: string; name: string }
  }
}

function getAvatarKey(email?: string) {
  return `iqanat-avatar-${(email || 'guest').toLowerCase()}`
}

function readStoredAvatar(email?: string) {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(getAvatarKey(email)) || ''
}

function storeAvatar(email: string | undefined, src: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(getAvatarKey(email), src)
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) router.push('/login')
        else setUser(data.user)
      })
      .finally(() => setLoading(false))
  }, [router])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-[#a9c7b8]">Загрузка...</div>
  }
  if (!user) return null

  if (user.role === 'STUDENT') {
    return (
      <Shell user={user} logout={logout}>
        <ProfileCard user={user} />
        {user.group && (
          <div className="card p-5 mb-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8] mb-2">Группа</div>
            <div className="text-xl font-bold text-white">Группа №{user.group.number}</div>
            {user.group.name && <div className="text-sm text-[#bfd6c8] mt-1">{user.group.name}</div>}
            {user.group.tutor && <div className="text-sm text-[#bfd6c8] mt-2">Тьютор: {user.group.tutor.name}</div>}
            {user.group.telegramLink && (
              <a href={user.group.telegramLink} target="_blank" rel="noreferrer" className="inline-block mt-4 text-[#6fe3a4] text-sm font-medium hover:underline">
                Перейти в Telegram-канал группы
              </a>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <NavCard href="/chat" title="Чат группы" desc="Общение в своей группе" />
          <NavCard href="/duels" title="Дуэли" desc="Предметные дуэли между группами" />
          <NavCard href="/leaderboard?scope=students" title="Лидерборд учеников" desc="Рейтинг учеников" />
          <NavCard href="/games" title="Мини-игры" desc="Короткие активности и задания" />
          <NavCard href="/detective" title="Детективный квест" desc="Погружение в историю и награда" />
        </div>
      </Shell>
    )
  }

  if (user.role === 'TUTOR') {
    return (
      <Shell user={user} logout={logout}>
        <ProfileCard user={user} />
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <NavCard href="/chat" title="Чат группы" desc="Коммуникация со своей группой" />
          <NavCard href="/leaderboard?scope=tutors" title="Лидерборд тьюторов" desc="Сравнение активности тьюторов" />
          <NavCard href="/duels" title="Дуэли тьюторов" desc="Соревнуйтесь с коллегами" />
          <NavCard href="/detective" title="Детективный квест" desc="Соперничество и игровые задания" />
          <NavCard href="/dashboard" title="Статистика группы" desc="Отслеживание вовлечённости" />
        </div>
      </Shell>
    )
  }

  return (
    <Shell user={user} logout={logout}>
      <ProfileCard user={user} />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        <NavCard href="/leaderboard?scope=students" title="Лидерборд учеников" desc="Полный рейтинг студентов" />
        <NavCard href="/leaderboard?scope=tutors" title="Лидерборд тьюторов" desc="Рейтинг наставников" />
        <NavCard href="/leaderboard?scope=all" title="Сводный рейтинг" desc="Общий директорский обзор" />
        <NavCard href="/duels" title="Дуэли" desc="Все игровые соревнования" />
        <NavCard href="/detective" title="Детективный квест" desc="Игровой сценарный модуль" />
        <NavCard href="/chat" title="Групповые чаты" desc="Диагностика активности команд" />
      </div>
    </Shell>
  )
}

function Shell({ user, logout, children }: { user: User; logout: () => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b border-white/10 bg-[#081912]/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="brand-mark">IQ</div>
            <div>
              <div className="brand-word text-lg tracking-[-0.06em] text-white">IQANAT</div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-[#cfe9d9]">cabinet</div>
            </div>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[#dff9e8] font-medium" style={{ color: user.textColor }}>
              {user.name}
            </span>
            <button onClick={logout} className="btn-ghost px-3 py-2 text-xs uppercase tracking-[0.16em]">Выйти</button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-10">{children}</main>
    </div>
  )
}

function ProfileCard({ user }: { user: User }) {
  const [avatar, setAvatar] = useState<string>('')

  useEffect(() => {
    setAvatar(readStoredAvatar(user.email))
  }, [user.email])

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const src = String(reader.result || '')
      setAvatar(src)
      storeAvatar(user.email, src)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="card p-5 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-[#0d1b18] flex items-center justify-center text-xl font-bold text-[#6fe3a4]">
              {avatar ? (
                <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#0d1b18] bg-[#6fe3a4] text-[#07130f] text-xs font-black shadow-lg">
              +
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            </label>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8]">Личный кабинет</div>
            <h1 className="mt-2 text-2xl md:text-3xl font-black tracking-[-0.05em] text-white">
              {user.name}
            </h1>
            <div className="mt-2 text-sm text-[#bfd6c8]">
              {roleLabels[user.role] || user.role}
              {user.region ? ` · ${user.region}` : ''}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1b18] px-4 py-3 text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8]">Поинты</div>
          <div className="mt-1 text-3xl font-black tracking-[-0.06em] text-[#6fe3a4]">{user.points}</div>
          <div className="mt-1 text-sm" style={{ color: user.textColor }}>{titleLabels[user.title] || user.title}</div>
        </div>
      </div>
    </div>
  )
}

function NavCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="card p-5 block">
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8] mb-3">Раздел</div>
      <div className="text-xl font-bold tracking-[-0.05em] text-white">{title}</div>
      <div className="mt-2 text-sm leading-6 text-[#bfd6c8]">{desc}</div>
    </Link>
  )
}
