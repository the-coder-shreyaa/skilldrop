const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const hash = (p) => bcrypt.hashSync(p, 10)

  // Add priya@test.com account
  const existing = await prisma.user.findUnique({ where: { email: 'priya@test.com' } })
  if (existing) {
    console.log('✅ priya@test.com already exists!')
    return
  }

  await prisma.user.create({
    data: {
      email: 'priya@test.com',
      password: hash('password123'),
      name: 'Priya Sharma',
      role: 'BUSINESS',
      bio: 'Business owner on SkillDrop.',
      skillScore: 0,
    },
  })

  console.log('✅ Added: priya@test.com / password123')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
