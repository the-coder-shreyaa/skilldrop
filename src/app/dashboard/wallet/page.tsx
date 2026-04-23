'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function WalletPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<any>(null)
  const [subs, setSubs] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ bio: '', github: '', linkedin: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (session?.user) {
      fetch('/api/me').then(r => r.json()).then(d => {
        setProfile(d)
        setForm({ bio: d.bio || '', github: d.github || '', linkedin: d.linkedin || '' })
      })
      fetch(`/api/submissions?studentId=${(session.user as any).id}`).then(r => r.json()).then(setSubs)
    }
  }, [session])

  const approved = subs.filter((s: any) => s.status === 'APPROVED')

  const handleShare = () => {
    const userId = (session?.user as any)?.id
    if (!userId) return
    const url = `${window.location.origin}/profile/${userId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const updated = await fetch('/api/me').then(r => r.json())
    setProfile(updated)
    setSaving(false)
    setEditMode(false)
  }

  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <p style={{ color: 'rgba(245,243,238,0.5)' }}>Loading...</p>
    </div>
  )

  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/profile/${(session?.user as any)?.id}` : ''

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.85)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
            <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/dashboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Dashboard</Link>
            <Link href="/dashboard/tasks" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Tasks</Link>
            <Link href="/dashboard/wallet" style={{ color: '#f0c040', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8, background: 'rgba(240,192,64,0.08)' }}>Wallet</Link>
            <Link href="/dashboard/leaderboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Leaderboard</Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: '100px 5% 60px', maxWidth: 1000, margin: '0 auto' }}>
        <span className="sec-label">Skill Wallet</span>
        <h2 className="sec-title" style={{ marginBottom: 8 }}>Your Verified Proof of Work</h2>
        <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14, marginBottom: 32 }}>
          This is your internship-backed resume. Skills shown here are earned — not claimed.
        </p>

        {/* Share Profile Banner */}
        <div style={{ background: 'linear-gradient(135deg, rgba(240,192,64,0.08), rgba(0,229,255,0.04))', border: '1px solid rgba(240,192,64,0.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>📤 Share Your Verified Resume</div>
            <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)', fontFamily: 'monospace' }}>{profileUrl}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleShare} className="btn-gold" style={{ fontSize: 13, padding: '9px 20px' }}>
              {copied ? '✅ Copied!' : '📋 Copy Link'}
            </button>
            <Link href={`/profile/${(session?.user as any)?.id}`} target="_blank" className="btn-ghost" style={{ textDecoration: 'none', fontSize: 13, padding: '9px 20px' }}>
              👁 Preview
            </Link>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card-glass" style={{ borderImage: 'linear-gradient(135deg, #f0c040, rgba(240,192,64,0.15)) 1', borderWidth: 2, borderStyle: 'solid', marginBottom: 24, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 22 }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: 'rgba(245,243,238,0.5)' }}>{profile.bio || 'Add a bio below...'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 32, color: '#f0c040' }}>{profile.skillScore}</div>
              <span style={{ fontSize: 10, color: 'rgba(245,243,238,0.4)', letterSpacing: 1.5 }}>TRUST SCORE</span>
            </div>
          </div>
          <div className="pill" style={{ background: 'rgba(240,192,64,0.1)', color: '#f0c040', marginBottom: 20 }}>
            🏆 Level {profile.level} · {approved.length} verified tasks
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {profile.skills.map((sk: any) => (
                <div key={sk.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(245,243,238,0.5)', marginBottom: 4 }}>
                    <span>{sk.name}</span>
                    <span>Level {sk.level} · {sk.tasksUsed} task{sk.tasksUsed !== 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(sk.level * 20, 100)}%`, background: 'linear-gradient(90deg, #f0c040, #ffd060)', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Badges */}
          {profile.badges?.length > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {profile.badges.map((b: any) => (
                <span key={b.id} className="pill" style={{ background: 'rgba(240,192,64,0.08)', color: '#f0c040', border: '1px solid rgba(240,192,64,0.2)' }}>
                  {b.badgeType === 'FIRST_DROP' ? '🔥' : b.badgeType === 'STREAK_7' ? '⚡' : b.badgeType === 'PERFECT_SCORE' ? '💎' : '🎯'} {b.badgeType.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Edit Profile Section */}
        <div className="card-glass" style={{ marginBottom: 32, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editMode ? 20 : 0 }}>
            <h3 style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 700, fontSize: 16, margin: 0 }}>✏️ Edit Public Profile</h3>
            <button onClick={() => setEditMode(!editMode)} className="btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }}>
              {editMode ? 'Cancel' : 'Edit'}
            </button>
          </div>
          {editMode && (
            <form onSubmit={handleSaveProfile} style={{ display: 'grid', gap: 14, marginTop: 16 }}>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)', display: 'block', marginBottom: 6 }}>Bio (shown on public profile)</label>
                <textarea className="input-dark" style={{ minHeight: 80 }} placeholder="Describe your skills and experience..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)', display: 'block', marginBottom: 6 }}>GitHub Username or URL</label>
                  <input className="input-dark" placeholder="your-username" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)', display: 'block', marginBottom: 6 }}>LinkedIn Username or URL</label>
                  <input className="input-dark" placeholder="your-name" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn-gold" disabled={saving}>{saving ? 'Saving...' : '💾 Save Profile'}</button>
            </form>
          )}
        </div>

        {/* Verified Work Entries */}
        <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 18, marginBottom: 18 }}>✅ Verified Internship History</h3>
        {approved.length === 0 ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: 'rgba(245,243,238,0.5)' }}>No verified work yet. <Link href="/dashboard/tasks" style={{ color: '#f0c040' }}>Complete a task →</Link></p>
          </div>
        ) : approved.map((s: any) => (
          <div key={s.id} className="card-glass" style={{ marginBottom: 14, borderLeft: '3px solid rgba(74,222,128,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 3 }}>{s.task?.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>at {s.task?.postedBy?.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="pill" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', display: 'block', marginBottom: 4 }}>Verified ✓</span>
                {s.certId && (
                  <span style={{ fontSize: 10, color: 'rgba(245,243,238,0.3)', fontFamily: 'monospace' }}>{s.certId}</span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 13, color: 'rgba(245,243,238,0.5)' }}>
              <span style={{ color: '#f0c040' }}>{'★'.repeat(Math.round(s.rating || 0))}{'☆'.repeat(5 - Math.round(s.rating || 0))}</span>
              <span>+{s.xpEarned} XP</span>
              <span>₹{s.task?.reward}</span>
              <span style={{ fontSize: 11 }}>{new Date(s.reviewedAt || s.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>
            {s.feedback && <p style={{ fontSize: 13, color: 'rgba(245,243,238,0.5)', marginTop: 8, fontStyle: 'italic' }}>"{s.feedback}"</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
