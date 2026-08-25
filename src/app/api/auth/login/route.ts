import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createToken, setSessionCookie } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
    }

    const valid = await verifyPassword(data.password, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      title: user.title,
      textColor: user.textColor,
      groupId: user.groupId,
    }

    const token = await createToken(sessionUser)
    await setSessionCookie(token)

    return NextResponse.json({ user: sessionUser })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Ошибка входа' }, { status: 500 })
  }
}
