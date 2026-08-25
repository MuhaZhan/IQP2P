'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'STUDENT', region: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')
      router.push('/onboarding')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-md card p-6 md:p-7">
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="brand-mark">IQ</div>
            <div>
              <div className="brand-word text-2xl text-white">IQANAT</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#cfe9d9]">peer to peer</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-[-0.05em] text-white">Регистрация</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-[#cfe9d9] mb-2">Имя</label>
            <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} required className="w-full px-4 py-3 text-sm" placeholder="Иван" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-[#cfe9d9] mb-2">Email</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required className="w-full px-4 py-3 text-sm" placeholder="name@iqanat.kz" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-[#cfe9d9] mb-2">Пароль</label>
            <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={6} className="w-full px-4 py-3 text-sm" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-[#cfe9d9] mb-2">Роль</label>
            <select value={form.role} onChange={(e) => update('role', e.target.value)} className="w-full px-4 py-3 text-sm">
              <option value="STUDENT">Ученик</option>
              <option value="TUTOR">Тьютор</option>
              <option value="CURATOR">Куратор</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-[0.18em] text-[#cfe9d9] mb-2">Регион</label>
            <input type="text" value={form.region} onChange={(e) => update('region', e.target.value)} className="w-full px-4 py-3 text-sm" placeholder="необязательно" />
          </div>
          {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm disabled:opacity-60">
            {loading ? 'Создание...' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="text-center text-sm text-[#bfd6c8] mt-5">
          Уже есть аккаунт? <Link href="/login" className="text-[#6fe3a4] hover:underline">Войти</Link>
        </p>
      </div>
    </div>
  )
}
