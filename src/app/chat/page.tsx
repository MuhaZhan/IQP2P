'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Message = {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    role: string
    textColor: string
  }
}

type GroupInfo = {
  id: string
  number: number
  name?: string | null
  subject?: string | null
}

export default function ChatPage() {
  const [group, setGroup] = useState<GroupInfo | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  async function load() {
    const res = await fetch('/api/chat')
    const data = await res.json()
    setGroup(data.group)
    setMessages(data.messages || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function sendMessage() {
    if (!draft.trim()) return
    setSending(true)
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: draft.trim() }),
    })
    if (res.ok) {
      setDraft('')
      await load()
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b border-white/10 bg-[#081912]/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-18 flex items-center justify-between">
          <Link href="/dashboard" className="btn-ghost px-3 py-2 text-xs uppercase tracking-[0.16em]">Назад</Link>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8]">Группа</div>
            <div className="font-bold text-white">{group ? `№${group.number}${group.name ? ` · ${group.name}` : ''}` : 'Группа не назначена'}</div>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-4 md:p-6">
          <div className="space-y-4 min-h-[360px] max-h-[540px] overflow-y-auto pr-1">
            {loading ? (
              <div className="text-sm text-[#a9c7b8]">Загрузка сообщений...</div>
            ) : messages.length === 0 ? (
              <div className="text-sm text-[#a9c7b8]">В этой группе пока нет сообщений.</div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="rounded-2xl border border-white/10 bg-[#0d1b18] p-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="font-semibold text-white" style={{ color: message.user.textColor || '#ffffff' }}>{message.user.name}</div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-[#a9c7b8]">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="text-sm leading-7 text-[#dfece4]">{message.content}</div>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 flex gap-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 px-4 py-3 text-sm"
              placeholder="Напишите сообщение группе..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <button onClick={sendMessage} disabled={sending || !draft.trim()} className="btn-primary px-5 py-3 text-sm disabled:opacity-60">
              {sending ? '...' : 'Отправить'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
