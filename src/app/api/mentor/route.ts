import { NextResponse } from 'next/server'

// Smart AI Mentor — context-aware simulated responses (no API key needed)
// Future: swap generateReply() body to call OpenAI/Gemini

function generateReply(message: string, profile: any): string {
  const msg = message.toLowerCase()
  const level = profile?.level || 1
  const score = profile?.skillScore || 0
  const xp = profile?.xp || 0
  const skills = profile?.skills?.map((s: any) => s.name).join(', ') || 'none listed yet'
  const streak = profile?.streak || 0

  // Skill score improvement
  if (msg.includes('skill score') || msg.includes('score') || msg.includes('improve')) {
    return `Your current Skill Score is **${score}** — here's how to push it higher:\n\n1️⃣ **Quality over quantity** — aim for 4.5+ star ratings. Quality (35% weight) is the biggest factor in your score.\n\n2️⃣ **Stay consistent** — your streak is ${streak} days. Even short daily tasks boost your consistency score (20% weight).\n\n3️⃣ **Take harder tasks** — difficulty multiplies your score. Try MEDIUM or HARD tasks next.\n\n4️⃣ **Get feedback** — every client review you collect adds to your feedback count (25% weight).\n\nAt your current pace, you can hit ${score + 80}+ points within 2 weeks. 🚀`
  }

  // Level up / XP
  if (msg.includes('level') || msg.includes('xp') || msg.includes('level up') || msg.includes('faster')) {
    const xpNeeded = level === 1 ? 500 - xp : level === 2 ? 1500 - xp : level === 3 ? 3500 - xp : level === 4 ? 7000 - xp : 0
    return `You're at Level **${level}** with **${xp} XP** total.\n\n${xpNeeded > 0 ? `You need **${xpNeeded} more XP** to reach Level ${level + 1}.\n\n` : 'You\'re at the top level! 🏆\n\n'}**Fastest ways to earn XP:**\n• 🟡 EASY tasks → 50 XP each\n• 🔵 MEDIUM tasks → 100 XP each\n• 🔴 HARD tasks → 200 XP each\n• ⚡ EXPERT tasks → 400 XP each\n\nStrategy: If you need XP fast, do 3-4 MEDIUM tasks this week. If you want score too, go for 1 HARD task with perfect quality.`
  }

  // Next skills to build
  if (msg.includes('skill') && (msg.includes('next') || msg.includes('build') || msg.includes('learn') || msg.includes('focus'))) {
    const suggestions = getSkillSuggestions(skills, level)
    return `Based on your profile (Level ${level}, skills: ${skills || 'none yet'}), here's what I recommend:\n\n${suggestions}\n\nThe key is to pick **one skill and go deep** rather than spreading thin. Which of these interests you most?`
  }

  // Task matching
  if (msg.includes('task') && (msg.includes('match') || msg.includes('which') || msg.includes('find') || msg.includes('apply'))) {
    return `Here's how to pick the right tasks at Level **${level}**:\n\n✅ **Apply to tasks that match your existing skills** — your approval rate will be higher, earning you better reviews.\n\n✅ **Filter by difficulty** — ${level <= 2 ? 'stick to EASY/MEDIUM tasks for now to build your score base' : 'you\'re ready for HARD and EXPERT tasks — higher rewards + more XP'}.\n\n✅ **Read the task brief fully** — businesses love detailed, relevant submissions. Spend 5 mins planning before starting.\n\n✅ **Submit early** — tasks with fewer submissions get more attention from the business.\n\nHead to the [Tasks Marketplace](/dashboard/tasks) and filter by your skills! 🎯`
  }

  // Career path
  if (msg.includes('career') || msg.includes('path') || msg.includes('future') || msg.includes('job')) {
    return `Based on your skill profile (**${skills}**) and Level ${level}, here are career paths that align well:\n\n${getCareerPaths(skills)}\n\nSkillDrop's Skill Wallet is your competitive edge — verified proof of work beats a resume every time. Keep stacking real work experience here and you'll stand out to employers in Tier-1 cities too.`
  }

  // Streak
  if (msg.includes('streak') || msg.includes('daily') || msg.includes('habit')) {
    return `Your current streak is **${streak} days** — ${streak === 0 ? 'let\'s start one today!' : streak < 7 ? 'you\'re building momentum!' : streak < 30 ? 'great consistency! Keep it up!' : 'you\'re a streak master! 🔥'}\n\nStreaks account for 20% of your Skill Score. Here's how to maintain one:\n\n• Even submitting a partial task counts as activity\n• Browse and bookmark tasks daily — just 5 mins counts\n• Set a phone reminder at the same time each day\n\nHit a 7-day streak and you'll unlock the ⚡ **Streak Badge**! You're ${Math.max(7 - streak, 0)} days away.`
  }

  // Badges
  if (msg.includes('badge') || msg.includes('achievement')) {
    return `Badges on SkillDrop are your credibility signals — businesses can see them on your profile! 🏅\n\nHere's what to focus on first:\n\n🔥 **First Drop** — complete any one task (easiest badge to get)\n⚡ **7-Day Streak** — stay active for 7 days in a row\n🎯 **Perfect Score** — get a 5-star rating 3 times\n\nEach badge you earn makes your profile more attractive to businesses. Check your [Badge Collection](/dashboard/badges) to see your progress!`
  }

  // Earnings / money
  if (msg.includes('earn') || msg.includes('money') || msg.includes('reward') || msg.includes('₹') || msg.includes('pay')) {
    return `💰 To maximize earnings on SkillDrop:\n\n1. **HARD/EXPERT tasks pay ₹500–₹2000+** — once your score is 300+, businesses will trust you with these.\n\n2. **Build a niche** — specialists earn more than generalists. If you're strong in Figma or React, focus there.\n\n3. **Maintain quality** — a 4.8+ star rating makes businesses more likely to pick you *and* offer higher rewards.\n\n4. **Be fast + thorough** — submit complete, well-structured work. Businesses reward reliability.\n\nYour Skill Wallet tracks total earnings — grow it to ₹5,000 to unlock the 💰 High Earner badge!`
  }

  // Greeting / hello
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.length < 15) {
    return `Hey! 👋 Great to hear from you.\n\nI'm your SkillDrop Career Mentor. I can help you with:\n\n• 📈 Improving your Skill Score\n• 🎯 Finding the right tasks\n• 🚀 Leveling up faster\n• 💡 Choosing which skills to build\n• 🏅 Earning badges\n• 💰 Maximizing your rewards\n\nWhat would you like to work on today?`
  }

  // Default smart response
  return `Great question! Based on your profile (Level ${level}, Score ${score}):\n\nThe #1 thing you can do right now is **complete your next task with maximum quality**. Here's why:\n\n• Quality score has the highest weight (35%) in your Skill Score formula\n• A 5-star rating gives you +35 points per task\n• Consistent high ratings unlock better opportunities\n\nWant me to give you more specific advice? Try asking:\n• "What skills should I build next?"\n• "How do I reach Level ${level + 1} faster?"\n• "Which tasks should I apply to?"`
}

function getSkillSuggestions(currentSkills: string, level: number): string {
  const skills = currentSkills.toLowerCase()
  
  if (skills.includes('design') || skills.includes('figma') || skills.includes('canva')) {
    return `🎨 **Since you're into design:**\n• Learn **Framer or Webflow** — high demand, ₹800+ tasks\n• Explore **Motion Design (After Effects)** — rare skill = premium pay\n• Try **UI/UX Research** — combines your design eye with strategy`
  }
  if (skills.includes('code') || skills.includes('react') || skills.includes('python') || skills.includes('develop')) {
    return `💻 **Since you're into development:**\n• Add **Next.js / TypeScript** — most in-demand frontend combo\n• Learn **Supabase or Firebase** — backend without the complexity\n• Explore **API integration tasks** — quick turnaround, good pay`
  }
  if (skills.includes('writing') || skills.includes('content') || skills.includes('copy')) {
    return `✍️ **Since you're into writing:**\n• Learn **SEO fundamentals** — doubles the value of your writing\n• Try **Email copywriting** — high ROI for businesses, well-paid tasks\n• Explore **LinkedIn ghostwriting** — growing fast in India`
  }
  if (skills.includes('marketing') || skills.includes('social')) {
    return `📱 **Since you're into marketing:**\n• Learn **Meta Ads basics** — businesses pay ₹1000+ for ad campaigns\n• Try **Analytics (GA4)** — data-driven marketers earn more\n• Explore **Reels/Short video editing** — massive demand right now`
  }

  // Generic by level
  if (level <= 2) {
    return `🌱 **For beginners (Level ${level}):**\n• **Canva + Graphic Design** — low barrier, quick to learn, always in demand\n• **Content Writing** — start with social media captions\n• **Data Entry + Excel** — boring but pays well and builds your score fast`
  }
  return `🚀 **For experienced users (Level ${level}):**\n• **No-Code Tools (Webflow, Bubble)** — highest ₹/hour ratio right now\n• **Prompt Engineering** — AI integration tasks are exploding\n• **Video Editing (CapCut Pro)** — local businesses need this constantly`
}

function getCareerPaths(skills: string): string {
  const s = skills.toLowerCase()
  
  if (s.includes('design')) {
    return `🎨 **UI/UX Designer** — ₹4–12 LPA entry level, growing fast\n📱 **Product Designer** — tech startups actively hiring\n🖼️ **Brand Designer** — agencies in Tier-1 cities`
  }
  if (s.includes('develop') || s.includes('code') || s.includes('react')) {
    return `💻 **Frontend Developer** — ₹5–15 LPA, massive demand\n🔧 **Full-Stack Developer** — startups pay premium for this\n📊 **No-Code Developer** — ₹3–8 LPA, growing niche`
  }
  if (s.includes('marketing') || s.includes('writing')) {
    return `📢 **Digital Marketing Manager** — ₹4–10 LPA\n✍️ **Content Strategist** — SaaS companies hiring actively\n🎯 **Growth Hacker** — startup world, performance-based pay`
  }
  return `🌐 **Digital Services Freelancer** — build your own client base\n💼 **Operations Associate** — startups value well-rounded profiles\n📊 **Business Analyst** — data + communication skills combination`
}

export async function POST(req: Request) {
  const { message, profile } = await req.json()
  if (!message) return NextResponse.json({ error: 'No message provided' }, { status: 400 })

  // Simulate a slight delay (feels more natural)
  await new Promise(resolve => setTimeout(resolve, 800))

  const reply = generateReply(message, profile)
  return NextResponse.json({ reply })
}
