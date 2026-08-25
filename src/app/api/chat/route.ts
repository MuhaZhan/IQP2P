import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      groupId: true,
      group: {
        select: {
          id: true,
          number: true,
          name: true,
          subject: true,
        },
      },
    },
  })

  if (!user?.groupId) {
    return NextResponse.json({ group: null, messages: [] })
  }

  const messages = await prisma.message.findMany({
    where: { groupId: user.groupId },
    orderBy: { createdAt: 'asc' },
    take: 200,
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          role: true,
          textColor: true,
        },
      },
    },
  })

  return NextResponse.json({
    group: user.group,
    messages,
  })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const content = String(body.content || '').trim()
  if (!content) {
    return NextResponse.json({ error: 'Сообщение пустое' }, { status: 400 })
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.id },
    select: { groupId: true },
  })

  if (!currentUser?.groupId) {
    return NextResponse.json({ error: 'У пользователя нет группы' }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      content,
      userId: session.id,
      groupId: currentUser.groupId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
          textColor: true,
        },
      },
    },
  })

  return NextResponse.json({ message })
}
