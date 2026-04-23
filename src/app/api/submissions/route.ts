import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getXPForTask, calculateSkillScore } from '@/lib/gamification'

function genCertId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = 'INTERN-'
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)]
  return id
}

// POST /api/submissions — student submits work
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { taskId, content, fileUrl } = await req.json()
  if (!taskId || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const submission = await prisma.submission.create({
    data: { taskId, studentId: (session.user as any).id, content, fileUrl },
  })
  return NextResponse.json(submission)
}

// GET /api/submissions?taskId=x — get submissions for a task
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const taskId = searchParams.get('taskId')
  const studentId = searchParams.get('studentId')

  const where: any = {}
  if (taskId) where.taskId = taskId
  if (studentId) where.studentId = studentId

  const subs = await prisma.submission.findMany({
    where,
    include: {
      student: { select: { id: true, name: true, skillScore: true, level: true } },
      task: { select: { id: true, title: true, reward: true, difficulty: true, postedBy: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(subs)
}

// PATCH /api/submissions — business reviews submission
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { submissionId, status, rating, feedback } = await req.json()
  if (!submissionId || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const submission = await prisma.submission.findUnique({ where: { id: submissionId }, include: { task: true } })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Generate cert ID on first approval
  const certId = status === 'APPROVED' && !submission.certId ? genCertId() : undefined

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: { status, rating: rating || null, feedback: feedback || null, reviewedAt: new Date(), ...(certId ? { certId } : {}) },
  })

  // If approved — award XP, update score, then auto-check & award badges
  if (status === 'APPROVED') {
    const xpEarned = getXPForTask(submission.task.difficulty)
    const student = await prisma.user.findUnique({
      where: { id: submission.studentId },
      include: { badges: true },
    })
    if (student) {
      const allApproved = await prisma.submission.findMany({
        where: { studentId: student.id, status: 'APPROVED' },
        include: { task: true },
      })
      const avgRating = allApproved.reduce((sum, s) => sum + (s.rating || 0), 0) / Math.max(allApproved.length, 1)
      const diffMap: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3, EXPERT: 4 }
      const avgDiff = allApproved.reduce((sum, s) => sum + (diffMap[s.task.difficulty] || 1), 0) / Math.max(allApproved.length, 1)

      const newScore = calculateSkillScore({
        avgRating, feedbackCount: allApproved.length, streak: student.streak,
        avgDifficulty: avgDiff, tasksCompleted: allApproved.length,
      })
      const newTotalEarned = student.totalEarned + submission.task.reward

      await prisma.user.update({
        where: { id: student.id },
        data: {
          xp: student.xp + xpEarned,
          skillScore: newScore,
          totalEarned: newTotalEarned,
          level: newScore >= 700 ? 5 : newScore >= 500 ? 4 : newScore >= 300 ? 3 : newScore >= 100 ? 2 : 1,
        },
      })

      // Update UserSkill tasksUsed counters for each skill in this task
      const taskSkills = submission.task.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      for (const skillName of taskSkills) {
        const existing = await prisma.userSkill.findFirst({ where: { userId: student.id, name: { equals: skillName } } })
        if (existing) {
          await prisma.userSkill.update({ where: { id: existing.id }, data: { tasksUsed: existing.tasksUsed + 1, level: Math.min(Math.floor((existing.tasksUsed + 1) / 2) + 1, 5) } })
        } else {
          await prisma.userSkill.create({ data: { userId: student.id, name: skillName, tasksUsed: 1, level: 1 } })
        }
      }
      await prisma.submission.update({ where: { id: submissionId }, data: { xpEarned } })

      // --- Auto-award badges ---
      const existingTypes = student.badges.map(b => b.badgeType)
      const badgesToAward: string[] = []

      if (!existingTypes.includes('FIRST_DROP') && allApproved.length >= 1)
        badgesToAward.push('FIRST_DROP')
      if (!existingTypes.includes('PERFECT_SCORE') && allApproved.filter(s => (s.rating || 0) >= 4.9).length >= 3)
        badgesToAward.push('PERFECT_SCORE')
      if (!existingTypes.includes('STREAK_7') && student.streak >= 7)
        badgesToAward.push('STREAK_7')
      if (!existingTypes.includes('HIGH_EARNER') && newTotalEarned >= 5000)
        badgesToAward.push('HIGH_EARNER')

      if (badgesToAward.length > 0) {
        await prisma.userBadge.createMany({
          data: badgesToAward.map(badgeType => ({ userId: student.id, badgeType })),
        })
      }
    }
  }

  return NextResponse.json(updated)
}
