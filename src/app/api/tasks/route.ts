import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/tasks — list tasks with optional filters
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'OPEN'
  const skill = searchParams.get('skill')
  const category = searchParams.get('category')

  const where: any = { status }
  if (skill) where.skills = { contains: skill }
  if (category) where.category = category

  const tasks = await prisma.task.findMany({
    where,
    include: { postedBy: { select: { id: true, name: true } }, _count: { select: { submissions: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(tasks)
}

// POST /api/tasks — create task (business only)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as any).role !== 'BUSINESS') return NextResponse.json({ error: 'Only businesses can post tasks' }, { status: 403 })

  const data = await req.json()
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category || 'General',
      skills: data.skills || '',
      reward: data.reward || 0,
      xpReward: data.xpReward || 50,
      difficulty: data.difficulty || 'EASY',
      location: data.location,
      deadline: data.deadline ? new Date(data.deadline) : null,
      postedById: (session.user as any).id,
    },
  })
  return NextResponse.json(task)
}
