'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const QUESTIONS = [
	{
		q: 'Что означает Peer-to-Peer в IQanat?',
		options: [
			'Ученики учат учеников',
			'Только учителя преподают',
			'Онлайн-платформа без людей',
			'Экзамен без подготовки',
		],
		correct: 0,
	},
	{
		q: 'Кто такой Peer Tutor?',
		options: [
			'Учитель из школы',
			'Старшеклассник или участник программы, который помогает младшим',
			'Родитель ученика',
			'Администратор LMS',
		],
		correct: 1,
	},
	{
		q: 'Главный принцип программы?',
		options: [
			'Выиграл — прошёл, проиграл — выбыл',
			'Giving Back — передавай дальше то, что получил',
			'Только лучшие получают поддержку',
			'Учёба только офлайн',
		],
		correct: 1,
	},
	{
		q: 'Сколько раз в неделю обычно проходят онлайн-уроки?',
		options: ['1', '2', '5', 'Каждый день'],
		correct: 1,
	},
	{
		q: 'Что даёт высокий титул в системе?',
		options: [
			'Ничего',
			'Право на личный чат 1-на-1 с тьютором',
			'Автоматический грант',
			'Отмену тестов',
		],
		correct: 1,
	},
]

export default function DuelsPage() {
	const router = useRouter()
	const [user, setUser] = useState<any>(null)
	const [started, setStarted] = useState(false)
	const [index, setIndex] = useState(0)
	const [score, setScore] = useState(0)
	const [selected, setSelected] = useState<number | null>(null)
	const [finished, setFinished] = useState(false)
	const [earned, setEarned] = useState(0)

	useEffect(() => {
		fetch('/api/auth/me')
			.then((r) => r.json())
			.then((d) => {
				if (!d.user) router.push('/login')
				else setUser(d.user)
			})
	}, [router])

	function answer(i: number) {
		if (selected !== null) return
		setSelected(i)
		const correct = QUESTIONS[index].correct === i
		if (correct) setScore((s) => s + 1)

		setTimeout(() => {
			if (index + 1 < QUESTIONS.length) {
				setIndex(index + 1)
				setSelected(null)
			} else {
				const finalScore = score + (correct ? 1 : 0)
				const points = finalScore >= 4 ? 50 : finalScore >= 3 ? 30 : 10
				setEarned(points)
				setFinished(true)
				fetch('/api/duels/complete', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ score: finalScore, points }),
				}).catch(() => {})
			}
		}, 700)
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center text-[#a9c7b8]">
				Загрузка...
			</div>
		)
	}

	if (!started) {
		return (
			<div className="min-h-screen relative z-10">
				<header className="border-b border-white/10 bg-[#081912]/70 backdrop-blur-sm sticky top-0 z-40">
					<div className="max-w-3xl mx-auto px-4 h-18 flex items-center justify-between">
						<Link
							href="/dashboard"
							className="btn-ghost px-3 py-2 text-xs uppercase tracking-[0.16em]"
						>
							Назад
						</Link>
						<div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8]">
							Дуэль
						</div>
						<div className="w-20" />
					</div>
				</header>

				<main className="max-w-3xl mx-auto px-4 py-12 text-center">
					<div className="card p-8 md:p-10">
						<div className="text-[10px] uppercase tracking-[0.22em] text-[#dff9e8] mb-4">
							Тест на знания
						</div>
						<h1 className="text-3xl md:text-4xl font-black tracking-[-0.06em] text-white">
							Дуэль знаний
						</h1>
						<p className="mt-5 max-w-xl mx-auto text-[#cfe4d7] leading-7">
							Пять вопросов о принципах IQANAT, Peer-to-Peer и работе программы. 4–5
							верных ответов приносит максимум поинтов.
						</p>
						<button
							onClick={() => setStarted(true)}
							className="btn-primary px-8 py-3 mt-8 text-sm md:text-base"
						>
							Начать дуэль
						</button>
					</div>
				</main>
			</div>
		)
	}

	if (finished) {
		return (
			<div className="min-h-screen relative z-10 flex flex-col items-center justify-center px-4 text-center">
				<div className="card max-w-xl p-8 md:p-10">
					<div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8] mb-4">
						Результат
					</div>
					<h1 className="text-3xl font-black tracking-[-0.06em] text-white">
						Дуэль завершена
					</h1>
					<p className="mt-4 text-[#cfe4d7]">
						Правильных ответов: {score} из {QUESTIONS.length}
					</p>
					<p className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#6fe3a4]">
						+{earned} by
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-3">
						<button
							onClick={() => {
								setStarted(false)
								setIndex(0)
								setScore(0)
								setSelected(null)
								setFinished(false)
							}}
							className="btn-ghost px-5 py-3 text-sm"
						>
							Ещё раз
						</button>
						<Link
							href="/dashboard"
							className="btn-primary px-5 py-3 text-sm"
						>
							В кабинет
						</Link>
					</div>
				</div>
			</div>
		)
	}

	const q = QUESTIONS[index]

	return (
		<div className="min-h-screen relative z-10">
			<header className="border-b border-white/10 bg-[#081912]/70 backdrop-blur-sm sticky top-0 z-40">
				<div className="max-w-3xl mx-auto px-4 h-18 flex items-center justify-between">
					<Link
						href="/dashboard"
						className="btn-ghost px-3 py-2 text-xs uppercase tracking-[0.16em]"
					>
						Назад
					</Link>
					<div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8]">
						Вопрос {index + 1} / {QUESTIONS.length}
					</div>
					<div className="w-20" />
				</div>
			</header>

			<main className="max-w-3xl mx-auto px-4 py-10">
				<div className="card p-6 md:p-8">
					<h2 className="text-xl md:text-2xl font-bold tracking-[-0.04em] text-white leading-relaxed mb-6">
						{q.q}
					</h2>
					<div className="space-y-3">
						{q.options.map((opt, i) => {
							let extra = ''
							if (selected !== null) {
								if (i === q.correct) extra = 'border-[#6fe3a4] bg-[#123827]'
								else if (i === selected) extra = 'border-red-500/60 bg-red-500/10'
							}
							return (
								<button
									key={i}
									onClick={() => answer(i)}
									disabled={selected !== null}
									className={`w-full text-left px-4 py-3 rounded-2xl border border-white/10 bg-[#0d1b18] text-[#edf7f1] transition ${extra}`}
								>
									{opt}
								</button>
							)
						})}
					</div>
				</div>
			</main>
		</div>
	)
}
