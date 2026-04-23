import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { BADGES, UserStats } from '@/lib/gamification'

// GET /api/badges — get user's badges
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const badges = await prisma.userBadge.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { earnedAt: 'desc' },
  })
  return NextResponse.json(badges)
}

// POST /api/badges/check — check and award new badges
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: true,
      submissions: { where: { status: 'APPROVED' }, include: { task: true } },
    },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const existingTypes = user.badges.map(b => b.badgeType)
  const approvedSubs = user.submissions

  // Build user stats for badge evaluation
  const stats: UserStats = {
    tasksCompleted: approvedSubs.length,
    streak: user.streak,
    perfectRatings: approvedSubs.filter(s => (s.rating || 0) >= 4.9).length,
    teamTasks: 0, // Future: team task tracking
    originalSubmissions: approvedSubs.length, // Simplified for MVP
    arenaWins: 0, // Future: arena wins tracking
    avgRating: approvedSubs.length > 0
      ? approvedSubs.reduce((sum, s) => sum + (s.rating || 0), 0) / approvedSubs.length
      : 0,
    totalTasks: approvedSubs.length,
  }

  // Check which new badges to award
  const newBadges: string[] = []
  for (const badge of BADGES) {
    if (!existingTypes.includes(badge.type) && badge.condition(stats)) {
      newBadges.push(badge.type)
    }
  }

  // Also check HIGH_EARNER (special badge not in BADGES array)
  if (!existingTypes.includes('HIGH_EARNER') && user.totalEarned >= 5000) {
    newBadges.push('HIGH_EARNER')
  }

  // Award new badges
  if (newBadges.length > 0) {
    await prisma.userBadge.createMany({
      data: newBadges.map(badgeType => ({ userId, badgeType })),
    })
  }

  return NextResponse.json({ awarded: newBadges, total: existingTypes.length + newBadges.length })
}
