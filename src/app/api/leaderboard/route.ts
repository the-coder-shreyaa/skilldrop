import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/leaderboard — top users by skill score
export async function GET() {
  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { id: true, name: true, skillScore: true, level: true, xp: true, streak: true },
    orderBy: { skillScore: 'desc' },
    take: 20,
  })
  return NextResponse.json(users)
}
