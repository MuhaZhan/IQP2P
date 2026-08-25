import { NextResponse } from 'next/server'
import { getSession, addPoints } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const progress = await prisma.detectiveProgress.findUnique({
    where: { userId: session.id },
  })

  if (progress?.completed) {
    return NextResponse.json({ message: 'Уже пройдено', points: 0 })
  }

  await prisma.detectiveProgress.upsert({
    where: { userId: session.id },
    create: {
      userId: session.id,
      completed: true,
      currentScene: 6,
      pointsEarned: 100,
    },
    update: {
      completed: true,
      currentScene: 6,
      pointsEarned: 100,
    },
  })

  const updated = await addPoints(session.id, 100)

  return NextResponse.json({
    message: 'Поздравляем! +100 поинтов и титул Детектив',
    points: updated?.points,
    title: updated?.title,
  })
}
