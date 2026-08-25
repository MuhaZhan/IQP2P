import Link from 'next/link'

const roles = [
	{
		title: 'Ученик',
		text: 'Чат группы, предметные дуэли, мини-игры и система титулов.',
	},
	{
		title: 'Тьютор',
		text: 'Панель своей группы, горячая картошка, дуэли с другими тьюторами и рост вовлечённости.',
	},
	{
		title: 'Куратор',
		text: 'Полный обзор по группам, лидерам и активности по всей программе.',
	},
]

export default function HomePage() {
	return (
		<div className="min-h-screen relative z-10 overflow-hidden">
			<header className="border-b border-white/10 bg-[#081912]/70 backdrop-blur-sm">
				<div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="brand-mark">IQ</div>
						<div>
							<div className="brand-word text-xl tracking-[-0.08em] text-white">
								IQANAT
							</div>
							<div className="text-[10px] uppercase tracking-[0.2em] text-[#cfe9d9]">
								peer to peer
							</div>
						</div>
					</div>
					<Link
						href="/login"
						className="btn-primary px-5 py-2.5 text-sm"
					>
						Войти
					</Link>
				</div>
			</header>

			<main>
				<section className="max-w-6xl mx-auto px-4 py-16 md:py-22">
					<div className="grid items-center gap-12 md:grid-cols-[1.15fr_0.85fr]">
						<div>
							<div className="kicker mb-5">Peer to Peer education</div>
							<h1 className="text-4xl md:text-6xl font-black leading-[0.95] tracking-[-0.06em] max-w-xl">
								Знания передаются дальше, когда каждый помогает другому.
							</h1>
							<p className="mt-6 max-w-xl text-base md:text-lg text-[#cfe4d7] leading-8">
								IQANAT объединяет учеников, тьюторов и кураторов в одну
								систему: общение, конкуренция, задачи, дуэли, турнирный дух и
								постоянный рост через вовлечённость.
							</p>
							<div className="mt-8 flex flex-col sm:flex-row gap-3">
								<Link
									href="/login"
									className="btn-primary px-7 py-3.5 text-sm md:text-base"
								>
									Войти в аккаунт
								</Link>
								<Link
									href="/dashboard"
									className="btn-ghost px-7 py-3.5 text-sm md:text-base"
								>
									Смотреть кабинет
								</Link>
							</div>
						</div>

						<div className="relative">
							<div className="card p-6 md:p-7 bg-[#0e221c]/90 border border-white/10 rounded-[28px]">
								<div className="rounded-[24px] border border-[#5ad28d]/30 bg-gradient-to-br from-[#173b2d] via-[#0d221c] to-[#0a1714] p-5 shadow-[0_30px_60px_rgba(0,0,0,0.28)]">
									<div className="mb-5 text-[11px] uppercase tracking-[0.22em] text-[#dff9e8]">
										Peer to Peer
									</div>
									<div className="space-y-4">
										<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
											<div className="text-[10px] uppercase tracking-[0.2em] text-[#a9c7b8]">
												Активность
											</div>
											<div className="mt-3 text-4xl font-black tracking-[-0.06em] text-white">
												1 240
											</div>
											<div className="mt-1 text-sm text-[#cfe4d7]">
												участников в программе
											</div>
										</div>
										<div className="grid grid-cols-2 gap-3">
											<div className="rounded-2xl border border-white/10 bg-[#122a20] p-4">
												<div className="text-[10px] uppercase tracking-[0.2em] text-[#a9c7b8]">
													Группы
												</div>
												<div className="mt-2 text-3xl font-black text-white">
													12
												</div>
											</div>
											<div className="rounded-2xl border border-white/10 bg-[#122a20] p-4">
												<div className="text-[10px] uppercase tracking-[0.2em] text-[#a9c7b8]">
													Дуэли
												</div>
												<div className="mt-2 text-3xl font-black text-white">
													58
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="max-w-6xl mx-auto px-4 pb-16">
					<div className="grid md:grid-cols-3 gap-4">
						{roles.map((role) => (
							<div key={role.title} className="card p-5">
								<div className="text-[10px] uppercase tracking-[0.2em] text-[#dff9e8] mb-3">
									Роль
								</div>
								<div className="text-2xl font-bold tracking-[-0.05em] text-white">
									{role.title}
								</div>
								<p className="mt-3 text-sm leading-7 text-[#cfe4d7]">
									{role.text}
								</p>
							</div>
						))}
					</div>
				</section>
			</main>

			<footer className="border-t border-white/10 py-7 text-center text-xs uppercase tracking-[0.18em] text-[#9fc0ad]">
				IQANAT · peer to peer
			</footer>
		</div>
	)
}
