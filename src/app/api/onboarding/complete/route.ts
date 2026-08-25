import { NextResponse } from 'next/server'
import { getSession, addPoints } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const progress = await prisma.onboardingProgress.findUnique({
    where: { userId: session.id },
  })

  if (progress?.completed) {
    return NextResponse.json({ message: 'Уже пройдено', points: 0 })
  }

  await prisma.onboardingProgress.upsert({
    where: { userId: session.id },
    create: {
      userId: session.id,
      completed: true,
      step1Done: true,
      step2Done: true,
      step3Done: true,
      step4Done: true,
      rewardClaimed: true,
    },
    update: {
      completed: true,
      step1Done: true,
      step2Done: true,
      step3Done: true,
      step4Done: true,
      rewardClaimed: true,
    },
  })

  const updated = await addPoints(session.id, 50)

  return NextResponse.json({
    message: '+50 поинтов',
    points: updated?.points,
    title: updated?.title,
  })
}
