'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const ALL_BADGES = [
  { type: 'FIRST_DROP', name: 'First Drop', icon: '🔥', desc: 'Complete your first task on SkillDrop', rarity: 'Common' },
  { type: 'STREAK_7', name: '7-Day Streak', icon: '⚡', desc: 'Stay active for 7 consecutive days', rarity: 'Rare' },
  { type: 'PERFECT_SCORE', name: 'Perfect Score', icon: '🎯', desc: 'Receive a 5-star rating 3 times', rarity: 'Rare' },
  { type: 'TEAM_PLAYER', name: 'Team Player', icon: '🤝', desc: 'Collaborate on 3 team tasks', rarity: 'Epic' },
  { type: 'ORIGINAL', name: 'Originality Champion', icon: '🛡️', desc: 'Submit 100% original work 5 times', rarity: 'Epic' },
  { type: 'ARENA_TOP', name: 'Top of Arena', icon: '🏆', desc: 'Rank #1 in the Skill Battle Arena', rarity: 'Legendary' },
  { type: 'SPEED_DEMON', name: 'Speed Demon', icon: '💨', desc: 'Complete a task in under 2 hours', rarity: 'Rare' },
  { type: 'CONSISTENT', name: 'Consistency King', icon: '📅', desc: 'Complete tasks 10 weeks in a row', rarity: 'Epic' },
  { type: 'HIGH_EARNER', name: 'High Earner', icon: '💰', desc: 'Earn over ₹5,000 total rewards', rarity: 'Legendary' },
]

const RARITY_COLORS: Record<string, string> = {
  Common: '#888',
  Rare: '#00e5ff',
  Epic: '#b86cf5',
  Legendary: '#f0c040',
}

export default function BadgesPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<any>(null)
  const [earnedTypes, setEarnedTypes] = useState<string[]>([])

  useEffect(() => {
    if (session?.user) {
      fetch('/api/me').then(r => r.json()).then(d => {
        setProfile(d)
        setEarnedTypes(d.badges?.map((b: any) => b.badgeType) || [])
      })
    }
  }, [session])

  const earned = ALL_BADGES.filter(b => earnedTypes.includes(b.type))
  const locked = ALL_BADGES.filter(b => !earnedTypes.includes(b.type))

  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <p style={{ color: 'rgba(245,243,238,0.5)' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.85)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
            <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/dashboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Dashboard</Link>
            <Link href="/dashboard/tasks" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Tasks</Link>
            <Link href="/dashboard/wallet" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Wallet</Link>
            <Link href="/dashboard/badges" style={{ color: '#f0c040', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8, background: 'rgba(240,192,64,0.08)' }}>Badges</Link>
            <Link href="/dashboard/mentor" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Mentor</Link>
            <Link href="/dashboard/leaderboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Leaderboard</Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: '100px 5% 60px', maxWidth: 1100, margin: '0 auto' }}>
        <span className="sec-label">Achievement System</span>
        <h2 className="sec-title" style={{ marginBottom: 8 }}>Your Badge Collection</h2>
        <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14, marginBottom: 40 }}>
          {earned.length} of {ALL_BADGES.length} badges unlocked • Keep working to earn them all!
        </p>

        {/* Progress Bar */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(245,243,238,0.5)', marginBottom: 8 }}>
            <span>Collection Progress</span>
            <span>{Math.round((earned.length / ALL_BADGES.length) * 100)}%</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(earned.length / ALL_BADGES.length) * 100}%`, background: 'linear-gradient(90deg, #f0c040, #ffd060)', borderRadius: 4, transition: 'width 1s ease' }} />
          </div>
        </div>

        {/* Earned Badges */}
        {earned.length > 0 && (
          <>
            <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 16, marginBottom: 20, color: '#4ade80' }}>
              ✓ Earned ({earned.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
              {earned.map(badge => (
                <div key={badge.type} className="card-glass" style={{ padding: 24, textAlign: 'center', border: `1px solid ${RARITY_COLORS[badge.rarity]}33`, position: 'relative', overflow: 'hidden' }}>
                  {/* Glow */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${RARITY_COLORS[badge.rarity]}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
                  {/* Hexagonal Badge */}
                  <div style={{ width: 72, height: 72, margin: '0 auto 16px', background: `linear-gradient(135deg, ${RARITY_COLORS[badge.rarity]}33, ${RARITY_COLORS[badge.rarity]}11)`, borderRadius: '16px', border: `2px solid ${RARITY_COLORS[badge.rarity]}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, position: 'relative' }}>
                    {badge.icon}
                    <div style={{ position: 'absolute', top: -6, right: -6, background: RARITY_COLORS[badge.rarity], borderRadius: 6, padding: '2px 6px', fontSize: 9, fontWeight: 700, color: '#0a0a0f' }}>{badge.rarity}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{badge.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)', lineHeight: 1.5 }}>{badge.desc}</div>
                  <div style={{ marginTop: 12, fontSize: 11, color: '#4ade80', fontWeight: 600 }}>✓ UNLOCKED</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Locked Badges */}
        <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 16, marginBottom: 20, color: 'rgba(245,243,238,0.4)' }}>
          🔒 Locked ({locked.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {locked.map(badge => (
            <div key={badge.type} className="card-glass" style={{ padding: 24, textAlign: 'center', opacity: 0.5, filter: 'grayscale(1)' }}>
              <div style={{ width: 72, height: 72, margin: '0 auto 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '2px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                {badge.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{badge.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)', lineHeight: 1.5 }}>{badge.desc}</div>
              <div style={{ marginTop: 12, fontSize: 11, color: 'rgba(245,243,238,0.3)', fontWeight: 600 }}>🔒 LOCKED · {badge.rarity}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
