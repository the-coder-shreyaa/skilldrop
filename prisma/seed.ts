import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding SkillDrop database...')

  // Clean slate
  await prisma.userBadge.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.userSkill.deleteMany()
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  const hash = (p: string) => bcrypt.hashSync(p, 10)

  // ── BUSINESSES ────────────────────────────────────────────────
  const cafePriya = await prisma.user.create({
    data: {
      email: 'priya@cafearoma.in',
      password: hash('password123'),
      name: 'Cafe Aroma',
      role: 'BUSINESS',
      bio: 'Cosy specialty coffee café in Indore — we love working with creative students!',
      skillScore: 0,
    },
  })

  const techSpark = await prisma.user.create({
    data: {
      email: 'admin@techspark.io',
      password: hash('password123'),
      name: 'TechSpark Studio',
      role: 'BUSINESS',
      bio: 'Boutique dev studio building SaaS products for Indian SMBs.',
      skillScore: 0,
    },
  })

  // ── STUDENTS ──────────────────────────────────────────────────
  const aryan = await prisma.user.create({
    data: {
      email: 'aryan@student.com',
      password: hash('password123'),
      name: 'Aryan Mehta',
      role: 'STUDENT',
      bio: 'Final year CS student at DAVV Indore. Passionate about UI/UX and React.',
      skillScore: 312,
      xp: 650,
      level: 3,
      streak: 9,
      totalEarned: 2100,
      skills: {
        create: [
          { name: 'Figma', level: 3, tasksUsed: 4 },
          { name: 'React', level: 2, tasksUsed: 2 },
          { name: 'Canva', level: 2, tasksUsed: 3 },
        ],
      },
      badges: {
        create: [
          { badgeType: 'FIRST_DROP' },
          { badgeType: 'STREAK_7' },
        ],
      },
    },
  })

  const sneha = await prisma.user.create({
    data: {
      email: 'sneha@student.com',
      password: hash('password123'),
      name: 'Sneha Gupta',
      role: 'STUDENT',
      bio: 'Commerce + Marketing student. Love creating content & social media strategies.',
      skillScore: 187,
      xp: 350,
      level: 2,
      streak: 4,
      totalEarned: 950,
      skills: {
        create: [
          { name: 'Content Writing', level: 3, tasksUsed: 5 },
          { name: 'Social Media', level: 2, tasksUsed: 3 },
          { name: 'Canva', level: 1, tasksUsed: 2 },
        ],
      },
      badges: {
        create: [
          { badgeType: 'FIRST_DROP' },
        ],
      },
    },
  })

  const rohan = await prisma.user.create({
    data: {
      email: 'rohan@student.com',
      password: hash('password123'),
      name: 'Rohan Tiwari',
      role: 'STUDENT',
      bio: 'Self-taught developer building projects since Class 10. Currently exploring no-code tools.',
      skillScore: 498,
      xp: 1380,
      level: 2,
      streak: 14,
      totalEarned: 5200,
      skills: {
        create: [
          { name: 'Python', level: 4, tasksUsed: 7 },
          { name: 'Web Scraping', level: 3, tasksUsed: 5 },
          { name: 'Excel/Sheets', level: 2, tasksUsed: 4 },
        ],
      },
      badges: {
        create: [
          { badgeType: 'FIRST_DROP' },
          { badgeType: 'STREAK_7' },
          { badgeType: 'HIGH_EARNER' },
        ],
      },
    },
  })

  const meera = await prisma.user.create({
    data: {
      email: 'meera@student.com',
      password: hash('password123'),
      name: 'Meera Joshi',
      role: 'STUDENT',
      bio: 'Fine arts + digital illustration student. Turning sketches into stunning visuals.',
      skillScore: 74,
      xp: 150,
      level: 1,
      streak: 2,
      totalEarned: 400,
      skills: {
        create: [
          { name: 'Illustration', level: 2, tasksUsed: 2 },
          { name: 'Canva', level: 1, tasksUsed: 1 },
        ],
      },
    },
  })

  console.log('✅ Users created')

  // ── TASKS ─────────────────────────────────────────────────────
  const t1 = await prisma.task.create({
    data: {
      title: 'Design a Menu Card for Our Café',
      description: 'We need a beautiful A4 menu card for Cafe Aroma. It should match our warm, cozy brand — earthy tones, clean typography, handcrafted feel. Include sections for Coffee, Tea, Snacks, and Desserts. Deliver as print-ready PDF + editable Canva/Figma file.',
      category: 'Design',
      skills: 'Canva,Figma,Graphic Design',
      reward: 600,
      xpReward: 100,
      difficulty: 'MEDIUM',
      location: 'Indore',
      status: 'OPEN',
      postedById: cafePriya.id,
    },
  })

  const t2 = await prisma.task.create({
    data: {
      title: 'Write 5 Instagram Captions for Café Launch Week',
      description: 'We\'re launching Cafe Aroma\'s new menu next week and need 5 engaging Instagram captions. Tone: warm, witty, millennial. Each caption should be 80–120 words with relevant hashtags. Include a hook line + CTA for each post.',
      category: 'Writing',
      skills: 'Content Writing,Social Media,Copywriting',
      reward: 350,
      xpReward: 50,
      difficulty: 'EASY',
      location: 'Remote',
      status: 'OPEN',
      postedById: cafePriya.id,
    },
  })

  const t3 = await prisma.task.create({
    data: {
      title: 'Scrape & Organize Local Business Leads (Indore)',
      description: 'We need a clean spreadsheet of 200+ local businesses in Indore (restaurants, boutiques, gyms). Required columns: Business Name, Category, Phone, Google Maps link, Instagram handle (if available). Use Python/web scraping or manual research. Deliver as .xlsx file.',
      category: 'Data Entry',
      skills: 'Python,Web Scraping,Excel/Sheets',
      reward: 900,
      xpReward: 200,
      difficulty: 'HARD',
      location: 'Remote',
      status: 'OPEN',
      postedById: techSpark.id,
    },
  })

  const t4 = await prisma.task.create({
    data: {
      title: 'Build a Landing Page in Next.js',
      description: 'We need a responsive, pixel-perfect landing page for a new SaaS product. Design provided in Figma. Stack: Next.js + Tailwind CSS. Must include: hero section, features grid, pricing table, FAQ accordion, footer. Mobile responsive. Clean, commented code. Deploy on Vercel and share link.',
      category: 'Development',
      skills: 'React,Next.js,Tailwind CSS',
      reward: 1800,
      xpReward: 400,
      difficulty: 'EXPERT',
      location: 'Remote',
      status: 'OPEN',
      postedById: techSpark.id,
    },
  })

  const t5 = await prisma.task.create({
    data: {
      title: 'Create Social Media Kit — 10 Branded Templates',
      description: 'Design 10 reusable Canva templates for our social media: 4 feed posts, 3 stories, 2 carousels, 1 highlight cover set. Colors: navy + gold. Style: minimal luxury. All templates must be editable by non-designers. Share Canva template links.',
      category: 'Design',
      skills: 'Canva,Graphic Design,Branding',
      reward: 750,
      xpReward: 100,
      difficulty: 'MEDIUM',
      location: 'Remote',
      status: 'OPEN',
      postedById: cafePriya.id,
    },
  })

  console.log('✅ Tasks created')

  // ── SUBMISSIONS ───────────────────────────────────────────────
  // Aryan submitted + got approved on t1 (menu card)
  const s1 = await prisma.submission.create({
    data: {
      taskId: t1.id,
      studentId: aryan.id,
      content: 'Hi! I\'ve completed the Cafe Aroma menu card. I used Figma with a warm earthy palette (cream + dark brown + terracotta accents). The layout follows a clean grid with hand-drawn style dividers. Included all 4 sections. Delivery: PDF (300 DPI, CMYK) + Figma source file shared via link below.\n\nFigma link: figma.com/aryan-cafearoma-menu\nPDF preview: drive.google.com/preview-menu',
      status: 'APPROVED',
      rating: 5.0,
      feedback: 'Absolutely stunning work! Exactly the warm, cozy feel we wanted. Will definitely hire again. The PDF is print-ready and the Figma file is perfectly organized.',
      xpEarned: 100,
      reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  })

  // Sneha submitted + approved on t2 (Instagram captions)
  const s2 = await prisma.submission.create({
    data: {
      taskId: t2.id,
      studentId: sneha.id,
      content: 'Here are your 5 Instagram captions for launch week!\n\n📌 Day 1 (Grand Opening): "First sip, first story. ☕ Cafe Aroma opens its doors today — and the aroma alone is worth the visit. Come say hi, we\'ve saved your seat. 🌿 #CafeAromaIndore #NewOpeningIndore #CoffeeLovers"\n\n[+ 4 more captions with hooks, CTAs, and hashtag sets included in the Google Doc below]\n\nDoc: docs.google.com/sneha-captions-cafearoma',
      status: 'APPROVED',
      rating: 4.5,
      feedback: 'Really creative and on-brand! The hooks are catchy. Would\'ve loved slightly longer captions for Day 3 but overall excellent work. Hired her for next month too!',
      xpEarned: 50,
      reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  })

  // Rohan submitted + approved on t3 (data scraping)
  const s3 = await prisma.submission.create({
    data: {
      taskId: t3.id,
      studentId: rohan.id,
      content: 'Delivered! I wrote a Python script using BeautifulSoup + Selenium to scrape Google Maps and JustDial for Indore businesses. Then cleaned the data with pandas.\n\nFinal dataset: 247 businesses across 12 categories. All columns filled — 94% have Instagram handles found via Google search automation.\n\nSpreadsheet: drive.google.com/rohan-indore-leads-247\nPython script included in the same folder.\n\nLet me know if you need any specific categories added!',
      status: 'APPROVED',
      rating: 5.0,
      feedback: 'This is seriously impressive work. 247 records, clean data, script included — went above and beyond. The Instagram handle automation alone saved us 4 hours. 10/10.',
      xpEarned: 200,
      reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  })

  // Meera submitted on t5 (social media kit) — PENDING review
  const s4 = await prisma.submission.create({
    data: {
      taskId: t5.id,
      studentId: meera.id,
      content: 'Hello! I\'ve completed all 10 Canva templates for the social media kit.\n\nI used your navy + gold palette with a minimal luxury aesthetic. All templates are grouped and labeled clearly so your team can edit without design experience.\n\nCanva Template Links:\n• Feed Posts (4): canva.com/meera-feed-set\n• Stories (3): canva.com/meera-stories-set\n• Carousels (2): canva.com/meera-carousel-set\n• Highlight Covers (1 set of 8): canva.com/meera-highlights\n\nLooking forward to your feedback!',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  })

  // Aryan also submitted on t5 — PENDING
  const s5 = await prisma.submission.create({
    data: {
      taskId: t5.id,
      studentId: aryan.id,
      content: 'Completed the full social media kit! I went with a modern luxury direction — navy (#0A1628) and champagne gold (#C9A84C) across all 10 templates.\n\nHighlights:\n• Feed: Bold quote posts + product showcase layouts\n• Stories: Poll template + announcement + countdown\n• Carousels: "Did you know" series + tips format\n• Highlight covers: 8 covers with matching icons\n\nAll templates shared as editable Canva links in this folder: canva.com/aryan-social-kit-cafearoma',
      status: 'PENDING',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  })

  console.log('✅ Submissions created')
  console.log('\n🎉 Seed complete! Demo accounts ready:\n')
  console.log('  🎓 Student (Aryan):  aryan@student.com  / password123')
  console.log('  🎓 Student (Sneha):  sneha@student.com  / password123')
  console.log('  🎓 Student (Rohan):  rohan@student.com  / password123')
  console.log('  🎓 Student (Meera):  meera@student.com  / password123')
  console.log('  🏢 Business (Café):  priya@cafearoma.in / password123')
  console.log('  🏢 Business (Tech):  admin@techspark.io / password123')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
