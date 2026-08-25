import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hash = await bcrypt.hash('password123', 12)

  // ── Curator ──
  const curator = await prisma.user.upsert({
    where: { email: 'curator@iqanat.kz' },
    update: {},
    create: {
      email: 'curator@iqanat.kz',
      password: hash,
      name: 'Айнур Куратор',
      role: 'CURATOR',
      points: 0,
      title: 'LEGEND',
      textColor: '#f472b6',
    },
  })

  // ── Tutors ──
  const tutor1 = await prisma.user.upsert({
    where: { email: 'tutor1@iqanat.kz' },
    update: {},
    create: {
      email: 'tutor1@iqanat.kz',
      password: hash,
      name: 'Диас Тьютор',
      role: 'TUTOR',
      points: 200,
      title: 'MENTOR',
      textColor: '#34d399',
      region: 'Алматинская',
    },
  })

  const tutor2 = await prisma.user.upsert({
    where: { email: 'tutor2@iqanat.kz' },
    update: {},
    create: {
      email: 'tutor2@iqanat.kz',
      password: hash,
      name: 'Айгерим Тьютор',
      role: 'TUTOR',
      points: 180,
      title: 'MENTOR',
      textColor: '#34d399',
      region: 'Шымкент',
    },
  })

  // ── Groups ──
  const group1 = await prisma.group.upsert({
    where: { number: 1 },
    update: {},
    create: {
      number: 1,
      name: 'Группа 1',
      subject: 'math',
      telegramLink: 'https://t.me/+example_group1',
      tutorId: tutor1.id,
    },
  })

  const group2 = await prisma.group.upsert({
    where: { number: 2 },
    update: {},
    create: {
      number: 2,
      name: 'Группа 2',
      subject: 'logic',
      telegramLink: 'https://t.me/+example_group2',
      tutorId: tutor2.id,
    },
  })

  // ── Students ──
  const students = [
    { email: 'student1@iqanat.kz', name: 'Айдар', groupId: group1.id },
    { email: 'student2@iqanat.kz', name: 'Камила', groupId: group1.id },
    { email: 'student3@iqanat.kz', name: 'Нурлан', groupId: group1.id },
    { email: 'student4@iqanat.kz', name: 'Аружан', groupId: group2.id },
    { email: 'student5@iqanat.kz', name: 'Ерлан', groupId: group2.id },
  ]

  for (const s of students) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        password: hash,
        name: s.name,
        role: 'STUDENT',
        points: 0,
        title: 'NOVICE',
        groupId: s.groupId,
      },
    })
  }

  // ── Questions ──
  const questions = [
    // MATH
    {
      subject: 'math',
      text: 'Чему равно 17² − 15²?',
      options: JSON.stringify(['32', '64', '60', '68']),
      correct: 1,
      difficulty: 'medium',
    },
    {
      subject: 'math',
      text: 'Сколько простых чисел меньше 20?',
      options: JSON.stringify(['7', '8', '9', '10']),
      correct: 1,
      difficulty: 'medium',
    },
    {
      subject: 'math',
      text: 'Если 3x + 7 = 22, то x = ?',
      options: JSON.stringify(['3', '5', '7', '4']),
      correct: 1,
      difficulty: 'easy',
    },
    {
      subject: 'math',
      text: 'Площадь круга радиусом 3 равна (π≈3.14):',
      options: JSON.stringify(['18.84', '28.26', '9.42', '37.68']),
      correct: 1,
      difficulty: 'medium',
    },
    {
      subject: 'math',
      text: 'Сумма углов треугольника всегда равна:',
      options: JSON.stringify(['90°', '180°', '270°', '360°']),
      correct: 1,
      difficulty: 'easy',
    },
    // LOGIC
    {
      subject: 'logic',
      text: 'Все розы — цветы. Некоторые цветы быстро вянут. Значит:',
      options: JSON.stringify([
        'Все розы быстро вянут',
        'Некоторые розы могут быстро вянуть',
        'Розы не вянут',
        'Нельзя сделать вывод',
      ]),
      correct: 1,
      difficulty: 'medium',
    },
    {
      subject: 'logic',
      text: 'Найди лишнее: 2, 3, 5, 7, 11, 15, 17',
      options: JSON.stringify(['11', '15', '17', '3']),
      correct: 1,
      difficulty: 'medium',
    },
    {
      subject: 'logic',
      text: 'Если сегодня среда, то послезавтра будет:',
      options: JSON.stringify(['Четверг', 'Пятница', 'Суббота', 'Воскресенье']),
      correct: 1,
      difficulty: 'easy',
    },
    {
      subject: 'logic',
      text: 'Продолжи ряд: 1, 1, 2, 3, 5, 8, ?',
      options: JSON.stringify(['10', '11', '13', '12']),
      correct: 2,
      difficulty: 'medium',
    },
    {
      subject: 'logic',
      text: 'У Абая два брата. У каждого брата столько же сестёр, сколько братьев. Сколько всего детей в семье?',
      options: JSON.stringify(['3', '4', '5', '6']),
      correct: 2,
      difficulty: 'hard',
    },
    // CRITICAL THINKING
    {
      subject: 'critical',
      text: 'В рекламе написано: «9 из 10 врачей рекомендуют». Что важно спросить?',
      options: JSON.stringify([
        'Сколько врачей опросили?',
        'Какой у них стаж?',
        'Где они работают?',
        'Все варианты важны',
      ]),
      correct: 3,
      difficulty: 'medium',
    },
    {
      subject: 'critical',
      text: '«После того как я надел талисман, сдал экзамен». Это пример:',
      options: JSON.stringify([
        'Причинно-следственной связи',
        'Ложной причинности (post hoc)',
        'Правильного вывода',
        'Статистического доказательства',
      ]),
      correct: 1,
      difficulty: 'hard',
    },
    {
      subject: 'critical',
      text: 'Какой вопрос лучше всего проверяет надёжность источника?',
      options: JSON.stringify([
        'Кто автор и какие у него компетенции?',
        'Сколько лайков у статьи?',
        'Красиво ли оформлен сайт?',
        'Есть ли картинки?',
      ]),
      correct: 0,
      difficulty: 'medium',
    },
    // PHYSICS (selective)
    {
      subject: 'physics',
      text: 'Единица силы в СИ:',
      options: JSON.stringify(['Джоуль', 'Ньютон', 'Ватт', 'Паскаль']),
      correct: 1,
      difficulty: 'easy',
    },
    {
      subject: 'physics',
      text: 'Скорость света в вакууме примерно:',
      options: JSON.stringify(['3×10⁵ м/с', '3×10⁸ м/с', '3×10⁶ м/с', '3×10⁷ м/с']),
      correct: 1,
      difficulty: 'medium',
    },
  ]

  for (const q of questions) {
    await prisma.question.create({ data: q })
  }

  // Mini-games
  await prisma.miniGame.createMany({
    data: [
      { type: 'QUESTION', prompt: 'Какой самый полезный совет ты получил от тьютора?' },
      { type: 'PHOTO', prompt: 'Поделись фото момента, когда тебе помогли или ты помог другому' },
      { type: 'QUESTION', prompt: 'За что ты благодарен своей группе на этой неделе?' },
    ],
  })

  console.log('Seed OK')
  console.log('--- Тестовые аккаунты (пароль у всех: password123) ---')
  console.log('Куратор:  curator@iqanat.kz')
  console.log('Тьютор1:  tutor1@iqanat.kz')
  console.log('Тьютор2:  tutor2@iqanat.kz')
  console.log('Ученик1:  student1@iqanat.kz  (группа 1)')
  console.log('Ученик2:  student2@iqanat.kz  (группа 1)')
  console.log('Ученик4:  student4@iqanat.kz  (группа 2)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
