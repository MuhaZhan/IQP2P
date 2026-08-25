import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const scope = (searchParams.get('scope') || 'students').toLowerCase()

  let where: Record<string, any> = {}
  if (scope === 'students') where.role = 'STUDENT'
  if (scope === 'tutors') where.role = 'TUTOR'
  if (scope === 'all') where = {}

  const users = await prisma.user.findMany({
    where,
    orderBy: { points: 'desc' },
    take: 50,
    select: {
      id: true,
      name: true,
      points: true,
      title: true,
      textColor: true,
      role: true,
      region: true,
    },
  })

  return NextResponse.json({ users, scope })
}
