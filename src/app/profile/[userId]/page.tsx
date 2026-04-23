'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const BADGE_META: Record<string, { icon: string; label: string; color: string }> = {
  FIRST_DROP:    { icon: '🔥', label: 'First Drop',    color: '#ff6b35' },
  PERFECT_SCORE: { icon: '💎', label: 'Perfect Score', color: '#00e5ff' },
  STREAK_7:      { icon: '⚡', label: '7-Day Streak',  color: '#f0c040' },
  HIGH_EARNER:   { icon: '💰', label: 'High Earner',  color: '#4ade80' },
}

const DIFF_COLOR: Record<string, string> = {
  EASY: '#4ade80', MEDIUM: '#f0c040', HARD: '#ff6b35', EXPERT: '#ff4d6d',
}

export default function PublicProfilePage() {
  const params = useParams()
  const userId = params?.userId as string
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!userId) return
    fetch(`/api/profile/${userId}`)
      .then(r => r.json())
      .then(d => { if (d.error) setError(d.error); else setProfile(d) })
      .finally(() => setLoading(false))
  }, [userId])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const levelNames = ['', 'ROOKIE', 'HUSTLER', 'BUILDER', 'EXPERT', 'LEGEND']
  const levelColors = ['', '#888', '#4ade80', '#00e5ff', '#f0c040', '#ff4d6d']

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(240,192,64,0.2)', borderTop: '3px solid #f0c040', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: 'rgba(245,243,238,0.5)' }}>Loading verified profile...</p>
      </div>
    </div>
  )

  if (error || !profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <div className="card-glass" style={{ textAlign: 'center', padding: 48, maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Profile Not Found</h2>
        <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14 }}>{error || 'This profile does not exist.'}</p>
        <Link href="/" className="btn-gold" style={{ display: 'inline-block', marginTop: 24, textDecoration: 'none' }}>Go Home</Link>
      </div>
    </div>
  )

  const lvl = Math.min(profile.level || 1, 5)
  const scorePercent = Math.min(Math.round((profile.skillScore / 1000) * 100), 100)

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.85)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
            <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span>
          </Link>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="pill" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontSize: 12 }}>✓ Verified Profile</span>
            <button onClick={handleShare} className="btn-ghost" style={{ fontSize: 13 }}>
              {copied ? '✅ Copied!' : '📤 Share'}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '90px 5% 80px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start', marginBottom: 40 }}>
          <div>
            <span className="sec-label">Verified Portfolio</span>
            <h1 className="sec-title" style={{ marginBottom: 10, fontSize: 38 }}>{profile.name}</h1>
            {profile.bio && <p style={{ fontSize: 16, color: 'rgba(245,243,238,0.6)', marginBottom: 16, maxWidth: 560 }}>{profile.bio}</p>}

            {/* Social Links */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
              {profile.github && (
                <a href={profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(245,243,238,0.7)', textDecoration: 'none', fontSize: 13 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(0,119,181,0.1)', border: '1px solid rgba(0,119,181,0.2)', borderRadius: 8, color: '#0077b5', textDecoration: 'none', fontSize: 13 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              )}
              <span className="pill" style={{ background: `rgba(${lvl === 5 ? '255,77,109' : lvl === 4 ? '240,192,64' : '0,229,255'},0.1)`, color: levelColors[lvl] }}>
                {levelNames[lvl]} — Level {lvl}
              </span>
            </div>
          </div>

          {/* Trust Score */}
          <div style={{ textAlign: 'center', padding: '24px 32px', background: 'linear-gradient(135deg, rgba(240,192,64,0.06), rgba(240,192,64,0.02))', border: '1px solid rgba(240,192,64,0.15)', borderRadius: 20, minWidth: 180 }}>
            <div className="score-ring" style={{ background: `conic-gradient(#f0c040 0% ${scorePercent}%, rgba(255,255,255,0.06) ${scorePercent}%)`, margin: '0 auto 16px' }}>
              <div className="score-inner">
                <span style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 800, fontSize: 26, color: '#f0c040' }}>{profile.skillScore}</span>
                <span style={{ fontSize: 6, color: 'rgba(245,243,238,0.5)', letterSpacing: 2 }}>TRUST SCORE</span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)', lineHeight: 1.6 }}>
              <div>⭐ {profile.avgRating}/5 avg rating</div>
              <div>✓ {profile.approvedCount} verified tasks</div>
              <div>💰 ₹{profile.totalEarned} earned</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 40 }}>
          {[
            { icon: '🎯', val: profile.approvedCount, label: 'Tasks Completed' },
            { icon: '⭐', val: `${profile.avgRating}/5`, label: 'Avg Rating' },
            { icon: '💰', val: `₹${profile.totalEarned}`, label: 'Total Earned' },
            { icon: '🔥', val: profile.streak, label: 'Day Streak' },
            { icon: '⚡', val: profile.xp, label: 'XP Points' },
          ].map(stat => (
            <div key={stat.label} className="card-glass" style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 800, fontSize: 22, color: '#f0c040' }}>{stat.val}</div>
              <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.5)', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginBottom: 40 }}>
          {/* Skill Heatmap */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 700, fontSize: 18, marginBottom: 18 }}>
              🧠 Real Skills — Backed by Work
            </h2>
            {profile.skillHeatmap?.length === 0 ? (
              <div className="card-glass" style={{ padding: 32, textAlign: 'center' }}>
                <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14 }}>Skills appear after completing internship tasks</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {profile.skillHeatmap?.map((sk: any) => {
                  const intensity = Math.min(sk.count, 5)
                  const opacity = 0.15 + (intensity / 5) * 0.7
                  return (
                    <div key={sk.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 110, fontSize: 13, fontWeight: 500, textAlign: 'right', flexShrink: 0 }}>{sk.name}</div>
                      <div style={{ flex: 1, height: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                        <div style={{ height: '100%', width: `${Math.min((sk.count / Math.max(...profile.skillHeatmap.map((s: any) => s.count), 1)) * 100, 100)}%`, background: `linear-gradient(90deg, rgba(240,192,64,${opacity}), rgba(255,208,96,${opacity * 0.8}))`, borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                          <span style={{ fontSize: 11, color: '#f0c040', fontWeight: 600 }}>{sk.count}× used</span>
                        </div>
                      </div>
                      <div style={{ width: 60, fontSize: 11, color: 'rgba(245,243,238,0.5)', textAlign: 'right' }}>
                        {sk.avgRating > 0 ? `⭐${sk.avgRating}` : ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Badges */}
            {profile.badges?.length > 0 && (
              <div style={{ marginTop: 28 }}>
                <h2 style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>🏅 Achievements</h2>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {profile.badges.map((b: any) => {
                    const meta = BADGE_META[b.badgeType] || { icon: '🎯', label: b.badgeType, color: '#f0c040' }
                    return (
                      <div key={b.id} style={{ padding: '10px 16px', background: `rgba(${meta.color === '#f0c040' ? '240,192,64' : meta.color === '#00e5ff' ? '0,229,255' : meta.color === '#4ade80' ? '74,222,128' : '255,107,53'},0.07)`, border: `1px solid ${meta.color}30`, borderRadius: 12, textAlign: 'center' }}>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>{meta.icon}</div>
                        <div style={{ fontSize: 11, color: meta.color, fontWeight: 600 }}>{meta.label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Verified Work Timeline */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 700, fontSize: 18, marginBottom: 18 }}>
              ✅ Verified Internship History
            </h2>
            {profile.submissions?.length === 0 ? (
              <div className="card-glass" style={{ padding: 40, textAlign: 'center' }}>
                <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14 }}>No verified work yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {profile.submissions.map((s: any) => (
                  <div key={s.id} className="card-glass" style={{ padding: 20, borderLeft: `3px solid ${DIFF_COLOR[s.task.difficulty] || '#f0c040'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{s.task.title}</div>
                        <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>at {s.task.postedBy?.name}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="pill" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', display: 'block', marginBottom: 4 }}>✓ Verified</span>
                        {s.certId && <span style={{ fontSize: 10, color: 'rgba(245,243,238,0.3)', fontFamily: 'monospace' }}>{s.certId}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                      {s.task.skills.split(',').map((sk: string) => (
                        <span key={sk.trim()} style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, color: 'rgba(245,243,238,0.6)' }}>{sk.trim()}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(245,243,238,0.5)', alignItems: 'center' }}>
                      {s.rating && <span style={{ color: '#f0c040' }}>{'★'.repeat(Math.round(s.rating))}{'☆'.repeat(5 - Math.round(s.rating))}</span>}
                      <span style={{ color: DIFF_COLOR[s.task.difficulty] }}>{s.task.difficulty}</span>
                      <span>₹{s.task.reward}</span>
                      <span>{new Date(s.reviewedAt || s.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </div>
                    {s.feedback && <p style={{ fontSize: 12, color: 'rgba(245,243,238,0.4)', marginTop: 8, fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 8 }}>"{s.feedback}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA for hirers */}
        <div style={{ background: 'linear-gradient(135deg, rgba(240,192,64,0.08), rgba(0,229,255,0.04))', border: '1px solid rgba(240,192,64,0.15)', borderRadius: 20, padding: '36px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 800, fontSize: 22, marginBottom: 6 }}>Ready to hire {profile.name}?</div>
            <p style={{ color: 'rgba(245,243,238,0.6)', fontSize: 14, margin: 0 }}>This profile is 100% verified — skills proven through real internship tasks, not self-reported.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/signup?role=BUSINESS" className="btn-gold" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>🏢 Post a Task for Them</Link>
            <button onClick={handleShare} className="btn-ghost" style={{ whiteSpace: 'nowrap' }}>
              {copied ? '✅ Link Copied' : '📤 Share Profile'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
