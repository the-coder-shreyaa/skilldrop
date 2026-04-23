import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { skills: true, badges: true, _count: { select: { submissions: true, tasksPosted: true } } },
  })
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { password, ...safeUser } = user
  return NextResponse.json(safeUser)
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const updated = await prisma.user.update({
    where: { id: (session.user as any).id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.github !== undefined && { github: data.github }),
      ...(data.linkedin !== undefined && { linkedin: data.linkedin }),
    },
  })
  return NextResponse.json(updated)
}
