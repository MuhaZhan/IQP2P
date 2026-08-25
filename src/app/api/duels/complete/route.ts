import { NextRequest, NextResponse } from 'next/server'
import { getSession, addPoints } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const points = Math.min(Math.max(Number(body.points) || 0, 0), 50)
  const score = Number(body.score) || 0

  await prisma.gameScore.create({
    data: {
      userId: session.id,
      gameType: 'duel',
      score,
      pointsEarned: points,
    },
  })

  const updated = await addPoints(session.id, points)

  return NextResponse.json({
    points: updated?.points,
    title: updated?.title,
  })
}
