import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Public profile API — no auth required. Used for shareable portfolio pages.
export async function GET(req: Request, { params }: { params: { userId: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      skills: { orderBy: { tasksUsed: 'desc' } },
      badges: { orderBy: { earnedAt: 'asc' } },
      submissions: {
        where: { status: 'APPROVED' },
        include: {
          task: {
            select: {
              id: true,
              title: true,
              category: true,
              skills: true,
              difficulty: true,
              reward: true,
              postedBy: { select: { name: true } },
            },
          },
        },
        orderBy: { reviewedAt: 'desc' },
      },
    },
  })

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!user.isPublic) return NextResponse.json({ error: 'Profile is private' }, { status: 403 })

  const { password, email, ...safeUser } = user

  // Build skill heatmap: count across all approved tasks
  const skillMap: Record<string, { count: number; totalRating: number }> = {}
  user.submissions.forEach(sub => {
    const skills = sub.task.skills.split(',').map(s => s.trim()).filter(Boolean)
    skills.forEach(skill => {
      if (!skillMap[skill]) skillMap[skill] = { count: 0, totalRating: 0 }
      skillMap[skill].count++
      skillMap[skill].totalRating += sub.rating || 0
    })
  })

  const skillHeatmap = Object.entries(skillMap)
    .map(([name, data]) => ({
      name,
      count: data.count,
      avgRating: data.count > 0 ? +(data.totalRating / data.count).toFixed(1) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const approvedCount = user.submissions.length
  const avgRating = approvedCount > 0
    ? +(user.submissions.reduce((s, sub) => s + (sub.rating || 0), 0) / approvedCount).toFixed(1)
    : 0

  return NextResponse.json({
    ...safeUser,
    approvedCount,
    avgRating,
    skillHeatmap,
  })
}
