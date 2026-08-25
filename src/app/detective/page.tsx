'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SCENES = [
  {
    id: 1,
    title: 'The Mystery of Peer-to-Peer',
    text: `Ранним утром 12 марта ученик 8 класса Айдар обнаружил, что его тетрадь с заметками к олимпиаде IQanat исчезла. Без неё шансы пройти во второй тур казались почти нулевыми. В панике он позвал опытного детектива — выпускника IQanat.

Ты — этот детектив. Твоя миссия: найти улики, допросить участников и понять, кто (или что) стоит за исчезновением… и как система Peer-to-Peer может вернуть не только тетрадь, но и уверенность.`,
    label: 'Сцена 1',
  },
  {
    id: 2,
    title: 'Examine the Clues',
    text: `Ты заходишь в комнату Айдара. На столе — кружка с ещё тёплым чаем, открытый ноутбук с lms.iqanat.kz, стопка учебников и пустое место, где должна была лежать тетрадь.

На стене — фото: Айдар рядом с улыбающимся старшеклассником в футболке IQanat.

Улики:
• Горячий чай → готовился до утра
• Открытая LMS → уже в Peer-to-Peer
• Фото со старшеклассником → кто-то уже помогал
• Пустое место → тетрадь «исчезла» не случайно`,
    label: 'Сцена 2',
  },
  {
    id: 3,
    title: 'Question the Suspects',
    text: `В виртуальной комнате тебя ждут трое:

Айгерим (Peer Tutor): «Я занималась с Айдаром два раза в неделю. Вчера он сказал, что “всё понял”. Может, сам спрятал тетрадь?»

Диас (бывший Learner → Tutor): «Я сам не прошёл с первого раза. Но остался. Знания не исчезают — они передаются. Если тетрадь пропала, пора учиться без неё… вместе.»

Куратор Айнур: «Иногда ребята слишком полагаются на записи и забывают главное — Peer-to-Peer работает, когда ты готов и давать, и брать.»`,
    label: 'Сцена 3',
  },
  {
    id: 4,
    title: 'Draw Your Conclusions',
    text: `Детектив говорит: «Один из вас не врёт… а один ещё не понял главную улику.»

Кто (или что) на самом деле «украл» тетрадь Айдара?`,
    label: 'Сцена 4',
    choices: [
      { id: 'a', text: 'Айгерим специально спрятала, чтобы проверить его', correct: false },
      { id: 'b', text: 'Диас забрал, чтобы показать, что знания живут в людях', correct: false },
      { id: 'c', text: 'Сам Айдар спрятал от страха', correct: false },
      { id: 'd', text: 'Никто не крал. Тетрадь — символ. Настоящая пропажа — отсутствие привычки делиться знаниями', correct: true },
    ],
  },
  {
    id: 5,
    title: 'Great work, detective!',
    text: `Правильный ответ: никто не крал.

Тетрадь нашлась в кармане куртки Айдара. Он сам её «спрятал» от волнения. Но настоящая тайна раскрылась иначе.

Когда Айдар открыл LMS, там уже ждал урок с Айгерим. Диас прислал голосовое: «Не тетрадь важна. Важно, что ты теперь не один.»

Куратор добавил: «В Peer-to-Peer тысячи учеников и тьюторов. Знания здесь не исчезают — они размножаются. Тот, кто получил помощь, сам становится тем, кто помогает.»`,
    label: 'Сцена 5',
  },
  {
    id: 6,
    title: 'Case Closed',
    text: `Айдар улыбается, закрывает пустую тетрадь и открывает ноутбук. На экране — расписание следующих занятий.

Детектив выходит на крыльцо сельского дома, смотрит на звёзды и тихо говорит:

«Документ найден. Но важнее другое — система работает. Сегодня один ученик получил поддержку. Завтра он сам станет тьютором. Так и передаётся добро.»

Городские огни далеко, но в ауле уже горит свой свет — свет Peer-to-Peer.

Ты заработал +100 поинтов и титул «Детектив»!`,
    label: 'Финал',
    final: true,
  },
]

export default function DetectivePage() {
  const router = useRouter()
  const [scene, setScene] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) router.push('/login')
        else setUser(d.user)
      })
  }, [router])

  const current = SCENES[scene]

  function next() {
    if (scene < SCENES.length - 1) {
      setScene(scene + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  function handleChoice(id: string, correct: boolean) {
    setSelected(id)
    setShowResult(true)
    if (correct) {
      setTimeout(() => {
        next()
      }, 1800)
    }
  }

  async function claimReward() {
    try {
      await fetch('/api/detective/complete', { method: 'POST' })
    } catch {}
    router.push('/dashboard')
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-[#a9c7b8]">Загрузка...</div>
  }

  return (
    <div className="min-h-screen relative z-10">
      <header className="border-b border-white/10 bg-[#081912]/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-18 flex items-center justify-between">
          <Link href="/dashboard" className="btn-ghost px-3 py-2 text-xs uppercase tracking-[0.16em]">Назад</Link>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8]">{current.label}</div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 md:py-14">
        <div className="card p-6 md:p-8">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8] mb-5">Детективный квест</div>
          <h1 className="text-3xl md:text-4xl font-black tracking-[-0.06em] text-white mb-6">{current.title}</h1>
          <div className="whitespace-pre-line text-[#dfece4] leading-8 md:text-lg">{current.text}</div>

          {current.choices && !showResult && (
            <div className="mt-8 space-y-3">
              {current.choices.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleChoice(c.id, c.correct)}
                  className="w-full text-left px-4 py-3 rounded-2xl border border-white/10 bg-[#0d1b18] text-[#edf7f1] transition hover:border-[#6fe3a4]/60"
                >
                  {c.text}
                </button>
              ))}
            </div>
          )}

          {showResult && selected && (
            <div className={`mt-8 rounded-2xl border px-4 py-3 ${
              current.choices?.find((c) => c.id === selected)?.correct
                ? 'border-[#6fe3a4]/60 bg-[#123827] text-[#dff9e8]'
                : 'border-red-500/40 bg-red-500/10 text-red-100'
            }`}>
              {current.choices?.find((c) => c.id === selected)?.correct
                ? 'Верно. Ты заметил главную идею — знания не исчезают, они передаются.'
                : 'Не совсем. Главное — понимать, что Peer-to-Peer работает не только с тетрадями, но и с вовлечённостью.'}
            </div>
          )}

          {!current.choices && !current.final && (
            <button onClick={next} className="btn-primary px-7 py-3 text-sm mt-8">Далее</button>
          )}

          {current.final && (
            <button onClick={claimReward} className="btn-primary px-7 py-3 text-sm mt-8">Забрать награду</button>
          )}
        </div>
      </main>
    </div>
  )
}
