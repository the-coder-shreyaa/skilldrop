'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([])
  useEffect(() => { fetch('/api/leaderboard').then(r => r.json()).then(setUsers) }, [])

  const levelNames: Record<number, string> = { 1: 'Rookie', 2: 'Hustler', 3: 'Builder', 4: 'Expert', 5: 'Legend' }
  const levelColors: Record<number, string> = { 1: '#888', 2: '#4ade80', 3: '#00e5ff', 4: '#f0c040', 5: '#ff4d6d' }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.85)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}><span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span></Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link href="/dashboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8 }}>Home</Link>
            <Link href="/dashboard/tasks" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8 }}>Tasks</Link>
            <Link href="/dashboard/wallet" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8 }}>Wallet</Link>
            <Link href="/dashboard/badges" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8 }}>Badges</Link>
            <Link href="/dashboard/mentor" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8 }}>Mentor</Link>
            <Link href="/dashboard/leaderboard" style={{ color: '#f0c040', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8, background: 'rgba(240,192,64,0.08)' }}>Board</Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: '100px 5% 60px', maxWidth: 800, margin: '0 auto' }}>
        <span className="sec-label">Rankings</span>
        <h2 className="sec-title" style={{ marginBottom: 32 }}>🏆 Leaderboard</h2>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 32 }}>
            {[1, 0, 2].map(i => (
              <div key={i} className="card-glass" style={{ textAlign: 'center', padding: i === 0 ? '32px 20px' : '24px 20px', borderColor: i === 0 ? 'rgba(240,192,64,0.3)' : 'var(--border)', order: i === 0 ? -1 : i }}>
                <div style={{ fontSize: i === 0 ? 40 : 28, marginBottom: 10 }}>{i === 0 ? '🏆' : i === 1 ? '🥈' : '🥉'}</div>
                <div style={{ width: i === 0 ? 64 : 52, height: i === 0 ? 64 : 52, borderRadius: '50%', background: `linear-gradient(135deg, ${levelColors[users[i].level] || '#888'}, rgba(255,255,255,0.1))`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: i === 0 ? 18 : 14 }}>
                  {users[i].name?.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 15 }}>{users[i].name}</div>
                <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: i === 0 ? 28 : 22, color: '#f0c040', marginTop: 4 }}>{users[i].skillScore}</div>
                <span className="pill" style={{ background: `${levelColors[users[i].level]}18`, color: levelColors[users[i].level], marginTop: 8 }}>{levelNames[users[i].level]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Full Table */}
        <div className="card-glass" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Rank', 'Student', 'Score', 'Level', 'XP', 'Streak'].map(h => (
                  <th key={h} style={{ padding: '14px', textAlign: 'left', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(245,243,238,0.5)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u: any, i: number) => (
                <tr key={u.id} style={{ transition: '0.3s' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(240,192,64,0.04)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '14px', fontSize: 14, fontFamily: 'var(--font-syne), Syne', fontWeight: 800, color: i === 0 ? '#f0c040' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'rgba(245,243,238,0.5)' }}>
                    {i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </td>
                  <td style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${levelColors[u.level] || '#888'}, rgba(255,255,255,0.1))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
                      {u.name?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <span style={{ fontSize: 14 }}>{u.name}</span>
                  </td>
                  <td style={{ padding: '14px', fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 18, color: '#f0c040' }}>{u.skillScore}</td>
                  <td style={{ padding: '14px' }}><span className="pill" style={{ background: `${levelColors[u.level]}18`, color: levelColors[u.level] }}>{levelNames[u.level]}</span></td>
                  <td style={{ padding: '14px', fontSize: 13, color: 'rgba(245,243,238,0.5)' }}>{u.xp}</td>
                  <td style={{ padding: '14px', fontSize: 13 }}>🔥 {u.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
