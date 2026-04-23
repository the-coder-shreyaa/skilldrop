const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.userBadge.deleteMany()
  await prisma.userSkill.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  const hash = await bcrypt.hash('password123', 10)

  // Create students
  const priya = await prisma.user.create({ data: { email: 'priya@test.com', password: hash, name: 'Priya Sharma', role: 'STUDENT', skillScore: 847, xp: 5200, level: 4, streak: 14, totalEarned: 4500, bio: 'UI/UX Designer from Indore' } })
  const rahul = await prisma.user.create({ data: { email: 'rahul@test.com', password: hash, name: 'Rahul Kumar', role: 'STUDENT', skillScore: 801, xp: 4800, level: 4, streak: 10, totalEarned: 3800, bio: 'Full-stack developer' } })
  const ananya = await prisma.user.create({ data: { email: 'ananya@test.com', password: hash, name: 'Ananya Mishra', role: 'STUDENT', skillScore: 776, xp: 3200, level: 3, streak: 7, totalEarned: 2900, bio: 'Graphic Designer & illustrator' } })
  const dev = await prisma.user.create({ data: { email: 'dev@test.com', password: hash, name: 'Dev Patel', role: 'STUDENT', skillScore: 743, xp: 2800, level: 3, streak: 5, totalEarned: 2200, bio: 'Content writer & marketer' } })
  const sneha = await prisma.user.create({ data: { email: 'sneha@test.com', password: hash, name: 'Sneha Rawat', role: 'STUDENT', skillScore: 698, xp: 2100, level: 3, streak: 3, totalEarned: 1800, bio: 'Social media specialist' } })

  // Create businesses
  const cafe = await prisma.user.create({ data: { email: 'cafe@test.com', password: hash, name: 'Cafe Aroma', role: 'BUSINESS', bio: 'Premium cafe in Indore' } })
  const shop = await prisma.user.create({ data: { email: 'shop@test.com', password: hash, name: 'ShopEasy', role: 'BUSINESS', bio: 'E-commerce platform in Bhopal' } })
  const tech = await prisma.user.create({ data: { email: 'tech@test.com', password: hash, name: 'TechStart', role: 'BUSINESS', bio: 'Tech startup in Indore' } })

  // Skills for Priya
  await prisma.userSkill.createMany({ data: [
    { userId: priya.id, name: 'Figma', level: 4, tasksUsed: 8 },
    { userId: priya.id, name: 'Branding', level: 3, tasksUsed: 5 },
    { userId: priya.id, name: 'Motion Design', level: 2, tasksUsed: 3 },
  ]})

  // Badges for Priya
  await prisma.userBadge.createMany({ data: [
    { userId: priya.id, badgeType: 'FIRST_DROP' },
    { userId: priya.id, badgeType: 'STREAK_7' },
    { userId: priya.id, badgeType: 'PERFECT_SCORE' },
  ]})

  // Create tasks
  const tasks = await Promise.all([
    prisma.task.create({ data: { title: 'Design Instagram Post for Summer Menu', description: 'Create an eye-catching Instagram post showcasing our new summer drinks menu. Include our brand colors (warm tones) and make it feel premium yet fun.', category: 'Design', skills: 'Graphic Design,Canva,Figma', reward: 150, xpReward: 50, difficulty: 'EASY', location: 'Indore', postedById: cafe.id } }),
    prisma.task.create({ data: { title: 'Write 10 Product Descriptions', description: 'Write compelling product descriptions for 10 items in our electronics category. Each should be 50-80 words, SEO-friendly, and highlight key features.', category: 'Writing', skills: 'Copywriting,SEO,Content', reward: 200, xpReward: 75, difficulty: 'EASY', location: 'Bhopal', postedById: shop.id } }),
    prisma.task.create({ data: { title: 'Build a Landing Page', description: 'Create a responsive landing page for our new SaaS product. Dark theme, modern design, with hero section, features, pricing, and CTA. HTML/CSS/JS or React.', category: 'Development', skills: 'HTML,CSS,JavaScript,React', reward: 500, xpReward: 200, difficulty: 'HARD', location: 'Indore', postedById: tech.id } }),
    prisma.task.create({ data: { title: 'Create Logo Variations', description: 'Design 3 logo variations for our cafe rebrand. Minimalist style, must include coffee cup element. Deliver in SVG and PNG formats.', category: 'Design', skills: 'Logo Design,Illustrator,Branding', reward: 300, xpReward: 100, difficulty: 'MEDIUM', location: 'Indore', postedById: cafe.id } }),
    prisma.task.create({ data: { title: 'Social Media Calendar (1 Month)', description: 'Plan and create a 30-day social media content calendar for Instagram and Twitter. Include post ideas, captions, and hashtag strategy.', category: 'Marketing', skills: 'Social Media,Marketing,Content Strategy', reward: 400, xpReward: 150, difficulty: 'MEDIUM', location: 'Bhopal', postedById: shop.id } }),
    prisma.task.create({ data: { title: 'Data Entry - Product Catalog', description: 'Enter 200 products into our spreadsheet. Each entry needs: name, price, category, description, and image URL. Accuracy is critical.', category: 'Data Entry', skills: 'Excel,Data Entry,Attention to Detail', reward: 100, xpReward: 30, difficulty: 'EASY', location: 'Bhopal', postedById: shop.id } }),
    prisma.task.create({ data: { title: 'Design Mobile App UI Screens', description: 'Design 5 key screens for our food delivery app: Home, Menu, Cart, Order Tracking, Profile. Figma deliverable with components.', category: 'Design', skills: 'Figma,UI Design,Mobile Design', reward: 600, xpReward: 250, difficulty: 'HARD', location: 'Indore', postedById: tech.id } }),
    prisma.task.create({ data: { title: 'Write Blog Article on AI Trends', description: 'Write a 1500-word blog article about top AI trends in 2025 for Indian startups. Well-researched, engaging, with relevant examples.', category: 'Writing', skills: 'Blog Writing,Research,AI Knowledge', reward: 250, xpReward: 100, difficulty: 'MEDIUM', postedById: tech.id } }),
  ])

  // Create some submissions (completed work)
  await prisma.submission.create({ data: { taskId: tasks[0].id, studentId: priya.id, content: 'Here is the Instagram post design with summer vibes theme. Used warm gradient background with product photography overlay.', status: 'APPROVED', rating: 5.0, feedback: 'Excellent work! Exactly what we needed.', xpEarned: 50, reviewedAt: new Date() } })
  await prisma.submission.create({ data: { taskId: tasks[3].id, studentId: priya.id, content: 'Three logo variations: minimalist line art, emblem style, and wordmark with icon. All include coffee cup motif.', status: 'APPROVED', rating: 4.8, feedback: 'Beautiful designs, going with option 2!', xpEarned: 100, reviewedAt: new Date() } })
  await prisma.submission.create({ data: { taskId: tasks[1].id, studentId: dev.id, content: 'All 10 product descriptions completed. SEO optimized with primary and secondary keywords included.', status: 'APPROVED', rating: 4.5, feedback: 'Good quality writing, minor edits needed.', xpEarned: 75, reviewedAt: new Date() } })
  await prisma.submission.create({ data: { taskId: tasks[4].id, studentId: sneha.id, content: 'Complete 30-day calendar with post ideas, captions, and optimal posting times based on audience analysis.', status: 'PENDING' } })

  console.log('✅ Database seeded successfully!')
  console.log('📧 Test accounts (password: password123):')
  console.log('   Students: priya@test.com, rahul@test.com, ananya@test.com, dev@test.com, sneha@test.com')
  console.log('   Business: cafe@test.com, shop@test.com, tech@test.com')
}

main().catch(console.error).finally(() => prisma.$disconnect())
