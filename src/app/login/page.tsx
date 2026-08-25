'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка входа')
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10 py-12">
      <div className="w-full max-w-md card p-6 md:p-7">
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="brand-mark">IQ</div>
            <div>
              <div className="brand-word text-2xl text-white">IQANAT</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#cfe9d9]">peer to peer</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-[-0.05em] text-white">Вход в систему</h1>
          <p className="mt-2 text-sm text-[#bfd6c8]">Логин и пароль выдаёт администратор или куратор.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-[#cfe9d9] mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 text-sm" placeholder="name@iqanat.kz" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-[#cfe9d9] mb-2">Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 text-sm" placeholder="••••••••" />
          </div>
          {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm disabled:opacity-60">
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d1b18] p-4 text-xs leading-6 text-[#bfd6c8]">
          <div className="font-semibold text-white mb-1">Тестовые аккаунты</div>
          Пароль для всех: <span className="text-[#6fe3a4] font-medium">password123</span>
          <div className="mt-2">curator@iqanat.kz · tutor1@iqanat.kz · student1@iqanat.kz · student4@iqanat.kz</div>
        </div>

        <div className="mt-5 text-center text-sm text-[#bfd6c8]">
          Нет аккаунта? <Link href="/register" className="text-[#6fe3a4] hover:underline">Создать доступ</Link>
        </div>
      </div>
    </div>
  )
}
