'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [submissions, setSubs] = useState<any[]>([])
  const [leaderboard, setLB] = useState<any[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetch('/api/me').then(r => r.json()).then(setProfile)
      fetch(`/api/submissions?studentId=${(session.user as any).id}`).then(r => r.json()).then(setSubs)
      fetch('/api/leaderboard').then(r => r.json()).then(setLB)
    }
  }, [session])

  if (status === 'loading' || !profile) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}><p style={{ color: 'rgba(245,243,238,0.5)' }}>Loading...</p></div>

  const levelNames = ['', 'ROOKIE', 'HUSTLER', 'BUILDER', 'EXPERT', 'LEGEND']
  const levelColors = ['', '#888', '#4ade80', '#00e5ff', '#f0c040', '#ff4d6d']
  const xpMax = [0, 500, 1500, 3500, 7000, 99999]
  const xpMin = [0, 0, 500, 1500, 3500, 7000]
  const lvl = Math.min(profile.level || 1, 5)
  const progress = Math.round(((profile.xp - xpMin[lvl]) / (xpMax[lvl] - xpMin[lvl])) * 100)
  const scorePercent = Math.min(Math.round((profile.skillScore / 1000) * 100), 100)

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Top Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.85)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}><span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span></Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/dashboard" style={{ color: '#f0c040', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8, background: 'rgba(240,192,64,0.08)' }}>Dashboard</Link>
            <Link href="/dashboard/tasks" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Tasks</Link>
            <Link href="/dashboard/wallet" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Wallet</Link>
            <Link href="/dashboard/badges" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Badges</Link>
            <Link href="/dashboard/mentor" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Mentor</Link>
            <Link href="/dashboard/leaderboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Board</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} style={{ color: 'rgba(245,243,238,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: '7px 14px' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '100px 5% 60px', maxWidth: 1200, margin: '0 auto' }}>
        <span className="sec-label">Student Dashboard</span>
        <h2 className="sec-title" style={{ marginBottom: 32 }}>Welcome, {profile.name} 👋</h2>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {/* Score Ring */}
          <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 24 }}>
            <div className="score-ring" style={{ background: `conic-gradient(#f0c040 0% ${scorePercent}%, rgba(255,255,255,0.06) ${scorePercent}%)` }}>
              <div className="score-inner">
                <span style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 24, color: '#f0c040' }}>{profile.skillScore}</span>
                <span style={{ fontSize: 7, color: 'rgba(245,243,238,0.5)', letterSpacing: 1.5 }}>SCORE</span>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 14, color: levelColors[lvl] }}>{levelNames[lvl]}</div>
              <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)', marginTop: 4 }}>Level {lvl}</div>
            </div>
          </div>

          <div className="card-glass" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>⚡</div>
            <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 24, color: '#f0c040' }}>{profile.xp}</div>
            <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>Total XP</div>
          </div>

          <div className="card-glass" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🔥</div>
            <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 24, color: '#ff4d6d' }}>{profile.streak}</div>
            <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>Day Streak</div>
          </div>

          <div className="card-glass" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>💰</div>
            <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 24, color: '#4ade80' }}>₹{profile.totalEarned}</div>
            <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>Earned</div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="card-glass" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(245,243,238,0.5)', marginBottom: 8 }}>
            <span>Level {lvl} → Level {Math.min(lvl + 1, 5)}</span>
            <span>{progress}%</span>
          </div>
          <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #f0c040, #ffd060)', borderRadius: 5, transition: 'width 1s ease' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Recent Submissions */}
          <div className="card-glass">
            <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Recent Submissions</h3>
            {submissions.length === 0 ? (
              <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 13 }}>No submissions yet. <Link href="/dashboard/tasks" style={{ color: '#f0c040' }}>Browse tasks →</Link></p>
            ) : submissions.slice(0, 5).map((s: any) => (
              <div key={s.id} style={{ borderBottom: '1px solid var(--border)', padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{s.task?.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.5)' }}>{s.task?.postedBy?.name}</div>
                </div>
                <span className="pill" style={{
                  background: s.status === 'APPROVED' ? 'rgba(74,222,128,0.1)' : s.status === 'REJECTED' ? 'rgba(255,77,109,0.1)' : 'rgba(240,192,64,0.1)',
                  color: s.status === 'APPROVED' ? '#4ade80' : s.status === 'REJECTED' ? '#ff4d6d' : '#f0c040'
                }}>{s.status}</span>
              </div>
            ))}
          </div>

          {/* Leaderboard Mini */}
          <div className="card-glass">
            <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🏆 Leaderboard</h3>
            {leaderboard.slice(0, 5).map((u: any, i: number) => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 14, width: 24, color: i === 0 ? '#f0c040' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'rgba(245,243,238,0.5)' }}>
                  {i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${levelColors[Math.min(u.level || 1, 5)]}, rgba(255,255,255,0.1))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 11 }}>
                  {u.name?.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
                </div>
                <span style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 16, color: '#f0c040' }}>{u.skillScore}</span>
              </div>
            ))}
            <Link href="/dashboard/leaderboard" style={{ display: 'block', textAlign: 'center', fontSize: 13, color: '#f0c040', marginTop: 14, textDecoration: 'none' }}>View Full Leaderboard →</Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
          <Link href="/dashboard/tasks" className="btn-gold" style={{ textDecoration: 'none' }}>🎯 Browse Tasks</Link>
          <Link href="/dashboard/wallet" className="btn-ghost" style={{ textDecoration: 'none' }}>📁 Skill Wallet</Link>
          <Link href="/dashboard/badges" className="btn-ghost" style={{ textDecoration: 'none' }}>🏅 My Badges</Link>
          <Link href="/dashboard/mentor" className="btn-ghost" style={{ textDecoration: 'none' }}>🤖 AI Mentor</Link>
          <Link href="/dashboard/leaderboard" className="btn-ghost" style={{ textDecoration: 'none' }}>🏆 Leaderboard</Link>
        </div>
      </div>
    </div>
  )
}
