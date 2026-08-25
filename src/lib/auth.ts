import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'iqanat-p2p-secret-change-in-prod'
)

export type SessionUser = {
  id: string
  email: string
  name: string
  role: string
  points: number
  title: string
  textColor: string
  groupId?: string | null
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createToken(user: SessionUser) {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export function getTitleFromPoints(points: number): string {
  if (points >= 5000) return 'LEGEND'
  if (points >= 2000) return 'MASTER'
  if (points >= 800) return 'MENTOR'
  if (points >= 300) return 'LEARNER'
  if (points >= 100) return 'DETECTIVE'
  return 'NOVICE'
}

export function getTextColorFromTitle(title: string): string {
  const map: Record<string, string> = {
    NOVICE: '#9ca3af',
    LEARNER: '#60a5fa',
    DETECTIVE: '#a78bfa',
    MENTOR: '#34d399',
    MASTER: '#fbbf24',
    LEGEND: '#f472b6',
  }
  return map[title] || '#e5e7eb'
}

export async function addPoints(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null
  const newPoints = Math.max(0, user.points + amount)
  const newTitle = getTitleFromPoints(newPoints)
  const newColor = getTextColorFromTitle(newTitle)
  return prisma.user.update({
    where: { id: userId },
    data: { points: newPoints, title: newTitle, textColor: newColor },
  })
}

export const titleLabels: Record<string, string> = {
  NOVICE: 'Новичок',
  LEARNER: 'Ученик',
  DETECTIVE: 'Детектив',
  MENTOR: 'Наставник',
  MASTER: 'Мастер',
  LEGEND: 'Легенда',
}

export const roleLabels: Record<string, string> = {
  STUDENT: 'Ученик',
  TUTOR: 'Тьютор',
  CURATOR: 'Куратор',
  ADMIN: 'Админ',
}
