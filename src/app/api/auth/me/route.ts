import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      points: true,
      title: true,
      textColor: true,
      region: true,
      school: true,
      groupId: true,
      group: {
        select: {
          id: true,
          number: true,
          name: true,
          telegramLink: true,
          subject: true,
          tutor: { select: { id: true, name: true } },
        },
      },
    },
  })

  return NextResponse.json({ user })
}
