import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, createToken, setSessionCookie, getTitleFromPoints, getTextColorFromTitle } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['STUDENT', 'TUTOR', 'CURATOR']).optional().default('STUDENT'),
  region: z.string().optional(),
  school: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'Email уже зарегистрирован' }, { status: 400 })
    }

    const hashed = await hashPassword(data.password)
    const title = getTitleFromPoints(0)
    const textColor = getTextColorFromTitle(title)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        role: data.role,
        region: data.region,
        school: data.school,
        title,
        textColor,
        points: 0,
      },
    })

    // Create onboarding progress
    await prisma.onboardingProgress.create({
      data: { userId: user.id },
    })

    // Create detective progress
    await prisma.detectiveProgress.create({
      data: { userId: user.id },
    })

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      title: user.title,
      textColor: user.textColor,
    }

    const token = await createToken(sessionUser)
    await setSessionCookie(token)

    return NextResponse.json({
      user: sessionUser,
      message: 'Регистрация успешна!',
    })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || 'Ошибка регистрации' }, { status: 500 })
  }
}
