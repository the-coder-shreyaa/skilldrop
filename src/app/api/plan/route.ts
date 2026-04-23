import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// POST /api/plan — simulate plan upgrade (dummy payment)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json()
  if (!['FREE', 'MEDIUM', 'PREMIUM'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { plan },
  })

  return NextResponse.json({ success: true, plan })
}

// GET /api/plan — get current user plan
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { plan: true, name: true, email: true },
  })
  return NextResponse.json(user)
}
