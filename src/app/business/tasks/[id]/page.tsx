'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const DIFF_COLOR: Record<string, string> = {
  EASY: '#4ade80', MEDIUM: '#f0c040', HARD: '#ff6b35', EXPERT: '#ff4d6d',
}

export default function BusinessTaskDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const taskId = params?.id as string

  const [task, setTask] = useState<any>(null)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [reviewing, setReviewing] = useState<string | null>(null)
  const [reviewForm, setReviewForm] = useState({ status: 'APPROVED', rating: '5', feedback: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (session?.user && (session.user as any).role !== 'BUSINESS') router.push('/dashboard')
  }, [status, session, router])

  useEffect(() => {
    if (!taskId) return
    Promise.all([
      fetch(`/api/tasks/${taskId}`).then(r => r.json()),
      fetch(`/api/submissions?taskId=${taskId}`).then(r => r.json()),
    ]).then(([t, s]) => { setTask(t); setSubmissions(s) }).finally(() => setLoading(false))
  }, [taskId])

  const handleReview = async (submissionId: string) => {
    await fetch('/api/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId, ...reviewForm, rating: parseFloat(reviewForm.rating) }),
    })
    setReviewing(null)
    fetch(`/api/submissions?taskId=${taskId}`).then(r => r.json()).then(setSubmissions)
  }

  if (loading || !task) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <p style={{ color: 'rgba(245,243,238,0.5)' }}>Loading task...</p>
    </div>
  )

  const pending = submissions.filter(s => s.status === 'PENDING')
  const reviewed = submissions.filter(s => s.status !== 'PENDING')

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.85)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
            <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/business" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>← Dashboard</Link>
            <button onClick={() => signOut({ callbackUrl: '/' })} style={{ color: 'rgba(245,243,238,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, padding: '7px 14px' }}>Logout</button>
          </div>
        </div>
      </nav>

      <div style={{ padding: '100px 5% 60px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Task Header */}
        <div className="card-glass" style={{ marginBottom: 32, padding: '28px 32px', borderLeft: `4px solid ${DIFF_COLOR[task.difficulty] || '#f0c040'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span className="sec-label" style={{ marginBottom: 6 }}>{task.category}</span>
              <h1 style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 800, fontSize: 26, margin: '0 0 8px' }}>{task.title}</h1>
              <p style={{ color: 'rgba(245,243,238,0.6)', fontSize: 14, maxWidth: 600, margin: 0 }}>{task.description}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 800, fontSize: 28, color: '#4ade80' }}>Rs.{task.reward}</div>
              <span className="pill" style={{ background: 'rgba(240,192,64,0.1)', color: DIFF_COLOR[task.difficulty] }}>{task.difficulty}</span>
            </div>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {task.skills?.split(',').map((s: string) => (
              <span key={s.trim()} style={{ fontSize: 12, padding: '3px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(245,243,238,0.6)' }}>{s.trim()}</span>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 32 }}>
          {[
            { icon: '📨', val: submissions.length, label: 'Total Applicants' },
            { icon: '⏳', val: pending.length, label: 'Pending Review' },
            { icon: '✅', val: reviewed.filter(s => s.status === 'APPROVED').length, label: 'Approved' },
            { icon: '❌', val: reviewed.filter(s => s.status === 'REJECTED').length, label: 'Rejected' },
          ].map(s => (
            <div key={s.label} className="card-glass" style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 800, fontSize: 26, color: '#f0c040' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.5)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pending Review */}
        {pending.length > 0 && (
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 700, fontSize: 18, marginBottom: 18 }}>
              Pending Review ({pending.length})
            </h2>
            {pending.map(sub => (
              <div key={sub.id} className="card-glass" style={{ marginBottom: 16, padding: 24 }}>
                {/* Candidate Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #f0c040, rgba(240,192,64,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-syne),Syne', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                      {sub.student?.name?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{sub.student?.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>
                        Trust Score: <span style={{ color: '#f0c040', fontWeight: 700 }}>{sub.student?.skillScore}</span>
                        {' '}· Level {sub.student?.level}
                      </div>
                    </div>
                  </div>
                  <Link href={`/profile/${sub.student?.id}`} target="_blank"
                    style={{ padding: '8px 16px', background: 'rgba(240,192,64,0.08)', border: '1px solid rgba(240,192,64,0.2)', borderRadius: 10, color: '#f0c040', textDecoration: 'none', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                    View Verified Portfolio
                  </Link>
                </div>

                {/* Work Submitted */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.4)', marginBottom: 6 }}>Work submitted:</div>
                  <p style={{ fontSize: 14, color: 'rgba(245,243,238,0.8)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{sub.content}</p>
                  {sub.fileUrl && (
                    <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 13, color: '#00e5ff', textDecoration: 'none' }}>
                      View Attachment
                    </a>
                  )}
                </div>

                {/* Review Form */}
                {reviewing === sub.id ? (
                  <div style={{ background: 'rgba(240,192,64,0.04)', border: '1px solid rgba(240,192,64,0.15)', borderRadius: 12, padding: 20 }}>
                    <h4 style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Submit Review</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)', display: 'block', marginBottom: 6 }}>Decision</label>
                        <select className="input-dark" value={reviewForm.status} onChange={e => setReviewForm({ ...reviewForm, status: e.target.value })}>
                          <option value="APPROVED">Approve and Issue Certificate</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)', display: 'block', marginBottom: 6 }}>Rating (1 to 5)</label>
                        <select className="input-dark" value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: e.target.value })}>
                          {['5', '4.5', '4', '3.5', '3', '2', '1'].map(r => <option key={r} value={r}>{'★'.repeat(Math.round(parseFloat(r)))} ({r})</option>)}
                        </select>
                      </div>
                    </div>
                    <textarea className="input-dark" style={{ minHeight: 80, marginBottom: 12 }} placeholder="Feedback shown on student portfolio..." value={reviewForm.feedback} onChange={e => setReviewForm({ ...reviewForm, feedback: e.target.value })} />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn-gold" onClick={() => handleReview(sub.id)} style={{ fontSize: 13 }}>Submit Review</button>
                      <button className="btn-ghost" onClick={() => setReviewing(null)} style={{ fontSize: 13 }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-gold" onClick={() => { setReviewing(sub.id); setReviewForm({ status: 'APPROVED', rating: '5', feedback: '' }) }} style={{ fontSize: 13 }}>
                    Review Submission
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reviewed */}
        {reviewed.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-syne),Syne', fontWeight: 700, fontSize: 18, marginBottom: 18 }}>Reviewed Submissions</h2>
            {reviewed.map(sub => (
              <div key={sub.id} className="card-glass" style={{ marginBottom: 14, padding: 20, opacity: 0.75 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                      {sub.student?.name?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{sub.student?.name}</div>
                      {sub.certId && <div style={{ fontSize: 10, color: 'rgba(245,243,238,0.35)', fontFamily: 'monospace' }}>Cert: {sub.certId}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span className="pill" style={{
                      background: sub.status === 'APPROVED' ? 'rgba(74,222,128,0.1)' : 'rgba(255,77,109,0.1)',
                      color: sub.status === 'APPROVED' ? '#4ade80' : '#ff4d6d',
                    }}>{sub.status === 'APPROVED' ? 'Approved' : 'Rejected'}</span>
                    <Link href={`/profile/${sub.student?.id}`} target="_blank" style={{ fontSize: 12, color: '#f0c040', textDecoration: 'none' }}>Portfolio</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {submissions.length === 0 && (
          <div className="card-glass" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>📭</div>
            <p style={{ color: 'rgba(245,243,238,0.5)' }}>No submissions yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}
