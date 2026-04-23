'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function BusinessDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: 'Design', skills: '', reward: '', difficulty: 'EASY', location: '' })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (session?.user && (session.user as any).role !== 'BUSINESS') router.push('/dashboard')
  }, [status, session, router])

  useEffect(() => {
    if (session?.user) {
      fetch('/api/me').then(r => r.json()).then(setProfile)
      fetch('/api/tasks?status=OPEN').then(r => r.json()).then(d => setTasks(d.filter((t: any) => t.postedById === (session.user as any).id)))
    }
  }, [session])

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, reward: parseInt(form.reward) || 0 }) })
    setShowForm(false)
    setForm({ title: '', description: '', category: 'Design', skills: '', reward: '', difficulty: 'EASY', location: '' })
    fetch('/api/tasks?status=OPEN').then(r => r.json()).then(d => setTasks(d.filter((t: any) => t.postedById === (session?.user as any)?.id)))
  }

  if (!profile) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}><p style={{ color: 'rgba(245,243,238,0.5)' }}>Loading...</p></div>

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.85)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}><span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span></Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/business" style={{ color: '#f0c040', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8, background: 'rgba(240,192,64,0.08)' }}>Dashboard</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} style={{ color: 'rgba(245,243,238,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: '7px 14px' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '100px 5% 60px', maxWidth: 1200, margin: '0 auto' }}>
        <span className="sec-label">Business Dashboard</span>
        <h2 className="sec-title" style={{ marginBottom: 32 }}>Welcome, {profile.name} 🏢</h2>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 32 }}>
          <div className="card-glass" style={{ textAlign: 'center' }}><div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 28, color: '#f0c040' }}>{tasks.length}</div><div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>Active Tasks</div></div>
          <div className="card-glass" style={{ textAlign: 'center' }}><div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 28, color: '#00e5ff' }}>{tasks.reduce((s: number, t: any) => s + (t._count?.submissions || 0), 0)}</div><div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>Total Submissions</div></div>
          <div className="card-glass" style={{ textAlign: 'center' }}><div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 28, color: '#4ade80' }}>₹{tasks.reduce((s: number, t: any) => s + t.reward, 0)}</div><div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>Total Budget Posted</div></div>
        </div>

        {/* Post Task Button */}
        <button className="btn-gold" onClick={() => setShowForm(!showForm)} style={{ marginBottom: 24 }}>
          {showForm ? '✕ Cancel' : '+ Post New Task'}
        </button>

        {/* Task Form */}
        {showForm && (
          <div className="card-glass" style={{ marginBottom: 28, borderColor: 'rgba(240,192,64,0.2)', padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Create a Task</h3>
            <form onSubmit={handlePost} style={{ display: 'grid', gap: 14 }}>
              <input className="input-dark" placeholder="Task title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <textarea className="input-dark" style={{ minHeight: 100 }} placeholder="Describe the task in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <select className="input-dark" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="Design">Design</option><option value="Writing">Writing</option><option value="Development">Development</option><option value="Marketing">Marketing</option><option value="Data Entry">Data Entry</option>
                </select>
                <select className="input-dark" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="EASY">Easy</option><option value="MEDIUM">Medium</option><option value="HARD">Hard</option><option value="EXPERT">Expert</option>
                </select>
              </div>
              <input className="input-dark" placeholder="Skills (comma-separated): Figma, Canva" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <input className="input-dark" type="number" placeholder="Reward (₹)" value={form.reward} onChange={e => setForm({ ...form, reward: e.target.value })} />
                <input className="input-dark" placeholder="Location (optional)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
              <button type="submit" className="btn-gold">Post Task</button>
            </form>
          </div>
        )}

        {/* My Tasks */}
        <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>Your Tasks</h3>
        {tasks.length === 0 ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: 'rgba(245,243,238,0.5)' }}>No tasks posted yet. Click &quot;Post New Task&quot; to get started!</p>
          </div>
        ) : tasks.map((t: any) => (
          <Link href={`/business/tasks/${t.id}`} key={t.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card-glass" style={{ marginBottom: 14, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>{t.category} · ₹{t.reward} · {t._count?.submissions || 0} applicants</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                {(t._count?.submissions || 0) > 0 && (
                  <span style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(240,192,64,0.1)', color: '#f0c040', borderRadius: 20 }}>Review Candidates →</span>
                )}
                <span style={{ fontSize: 13, color: 'rgba(245,243,238,0.4)' }}>{t.status}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
