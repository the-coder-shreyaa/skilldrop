'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const CATEGORY_IMAGES: Record<string, string> = {
  Design: '/cat_design.png',
  Writing: '/cat_writing.png',
  Development: '/cat_dev.png',
  Marketing: '/cat_writing.png',
  'Data Entry': '/cat_dev.png',
}

const CATEGORY_COLORS: Record<string, string> = {
  Design: '#b86cf5',
  Writing: '#f0c040',
  Marketing: '#f0c040',
  Development: '#00e5ff',
  'Data Entry': '#4ade80',
}

export default function TasksPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<any[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(d => { setTasks(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter
    ? tasks.filter((t: any) =>
        t.category?.toLowerCase().includes(filter.toLowerCase()) ||
        t.skills?.toLowerCase().includes(filter.toLowerCase()) ||
        t.title?.toLowerCase().includes(filter.toLowerCase())
      )
    : tasks

  const diffColors: Record<string, string> = { EASY: '#4ade80', MEDIUM: '#f0c040', HARD: '#ff4d6d', EXPERT: '#a78bfa' }
  const diffBg: Record<string, string> = { EASY: 'rgba(74,222,128,0.1)', MEDIUM: 'rgba(240,192,64,0.1)', HARD: 'rgba(255,77,109,0.1)', EXPERT: 'rgba(167,139,250,0.1)' }

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.88)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
            <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link href="/dashboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8 }}>Home</Link>
            <Link href="/dashboard/tasks" style={{ color: '#f0c040', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8, background: 'rgba(240,192,64,0.08)' }}>Tasks</Link>
            <Link href="/dashboard/wallet" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8 }}>Wallet</Link>
            <Link href="/dashboard/badges" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8 }}>Badges</Link>
            <Link href="/dashboard/mentor" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8 }}>Mentor</Link>
            <Link href="/dashboard/leaderboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 12px', borderRadius: 8 }}>Board</Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: '90px 5% 60px', maxWidth: 1300, margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 36 }}>
          <span className="sec-label">Task Marketplace</span>
          <h2 className="sec-title" style={{ marginBottom: 8 }}>Find your next opportunity</h2>
          <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14 }}>
            Real tasks from verified businesses · Complete and earn XP + money
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '0 0 280px' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.4 }}>🔍</span>
            <input
              className="input-dark"
              style={{ paddingLeft: 40, width: '100%' }}
              placeholder="Search tasks or skills..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Design', 'Writing', 'Development', 'Marketing', 'Data Entry'].map(c => (
              <button
                key={c}
                onClick={() => setFilter(filter === c ? '' : c)}
                style={{
                  padding: '9px 18px', borderRadius: 999,
                  border: `1px solid ${filter === c ? CATEGORY_COLORS[c] || '#f0c040' : 'var(--border)'}`,
                  background: filter === c ? `${CATEGORY_COLORS[c] || '#f0c040'}14` : 'transparent',
                  color: filter === c ? (CATEGORY_COLORS[c] || '#f0c040') : 'rgba(245,243,238,0.5)',
                  fontSize: 13, cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'inherit',
                }}
              >{c}</button>
            ))}
            {filter && (
              <button onClick={() => setFilter('')} style={{ padding: '9px 14px', borderRadius: 999, border: '1px solid rgba(255,77,109,0.3)', background: 'rgba(255,77,109,0.08)', color: '#ff4d6d', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>✕ Clear</button>
            )}
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'rgba(245,243,238,0.4)' }}>
            {loading ? 'Loading...' : `${filtered.length} task${filtered.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(245,243,238,0.3)', fontSize: 14 }}>Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
            <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 15 }}>No tasks found matching &quot;{filter}&quot;</p>
            <button onClick={() => setFilter('')} style={{ marginTop: 16, background: 'none', border: 'none', color: '#f0c040', cursor: 'pointer', fontSize: 14 }}>Clear filter →</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {filtered.map((t: any) => (
              <Link href={`/dashboard/tasks/${t.id}`} key={t.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-glass" style={{ cursor: 'pointer', overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(240,192,64,0.1)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>

                  {/* Category Image Banner */}
                  <div style={{ position: 'relative', height: 110, margin: '-20px -20px 18px', overflow: 'hidden' }}>
                    <Image
                      src={CATEGORY_IMAGES[t.category] || '/cat_dev.png'}
                      alt={t.category}
                      fill
                      style={{ objectFit: 'cover', opacity: 0.55 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(10,10,15,0.95) 100%)' }} />
                    <div style={{ position: 'absolute', top: 14, left: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className="pill" style={{ background: `${CATEGORY_COLORS[t.category] || '#888'}22`, color: CATEGORY_COLORS[t.category] || '#888', border: `1px solid ${CATEGORY_COLORS[t.category] || '#888'}44`, fontSize: 11, backdropFilter: 'blur(8px)' }}>
                        {t.category}
                      </span>
                      <span className="pill" style={{ background: diffBg[t.difficulty], color: diffColors[t.difficulty], fontSize: 11, backdropFilter: 'blur(8px)' }}>
                        {t.difficulty}
                      </span>
                    </div>
                    {t.location && (
                      <div style={{ position: 'absolute', top: 14, right: 20, fontSize: 11, color: 'rgba(245,243,238,0.5)', backdropFilter: 'blur(8px)', background: 'rgba(10,10,15,0.5)', padding: '3px 10px', borderRadius: 99 }}>
                        📍 {t.location}
                      </div>
                    )}
                  </div>

                  {/* Task Info */}
                  <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 15, marginBottom: 6, lineHeight: 1.4 }}>{t.title}</h3>
                  <p style={{ fontSize: 12, color: 'rgba(245,243,238,0.4)', marginBottom: 10 }}>by {t.postedBy?.name}</p>
                  <p style={{ fontSize: 13, color: 'rgba(245,243,238,0.55)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {t.description}
                  </p>

                  {/* Skills */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                    {t.skills?.split(',').slice(0, 4).map((s: string) => (
                      <span key={s} className="pill" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(245,243,238,0.45)', border: '1px solid var(--border)', fontSize: 11 }}>
                        {s.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, color: '#f0c040' }}>₹{t.reward}</span>
                      <span style={{ fontSize: 11, color: 'rgba(245,243,238,0.35)', marginLeft: 8 }}>+{t.xpReward} XP</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 11, color: 'rgba(245,243,238,0.35)' }}>{t._count?.submissions || 0} submitted</span>
                      <span style={{ color: '#f0c040', fontSize: 13 }}>Apply →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
