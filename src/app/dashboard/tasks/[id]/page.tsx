'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const PLANS = { FREE: 'FREE', MEDIUM: 'MEDIUM', PREMIUM: 'PREMIUM' }

export default function TaskDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const [task, setTask] = useState<any>(null)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<{ url: string; type: string; name: string; size: number }[]>([])
  const [uploading, setUploading] = useState(false)
  const [userSubmissions, setUserSubmissions] = useState<any[]>([])
  const [userPlan, setUserPlan] = useState<string>('FREE')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/tasks/${params.id}`).then(r => r.json()).then(setTask)
    if (session?.user) {
      fetch('/api/me').then(r => r.json()).then(d => {
        setUserPlan(d.plan || 'FREE')
      })
      fetch(`/api/submissions?studentId=${(session.user as any).id}`)
        .then(r => r.json()).then(setUserSubmissions)
    }
  }, [params.id, session])

  // Check if student already submitted to this task
  const alreadySubmitted = userSubmissions.some((s: any) => s.taskId === params.id)
  // FREE plan: only 1 total submission allowed
  const isFreeLimited = userPlan === PLANS.FREE && userSubmissions.length >= 1 && !alreadySubmitted

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    if (uploadedFiles.length + files.length > 3) {
      setError('Maximum 3 files per submission.')
      return
    }
    setUploading(true)
    setError('')
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Upload failed'); break }
      setUploadedFiles(prev => [...prev, data])
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (url: string) => setUploadedFiles(prev => prev.filter(f => f.url !== url))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    setError('')
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: params.id,
        content,
        fileUrl: uploadedFiles.length > 0 ? JSON.stringify(uploadedFiles) : null,
      }),
    })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error || 'Submission failed')
    } else {
      setSubmitted(true)
    }
    setSubmitting(false)
  }

  const diffColors: Record<string, string> = { EASY: '#4ade80', MEDIUM: '#f0c040', HARD: '#ff4d6d', EXPERT: '#a78bfa' }
  const formatSize = (bytes: number) => bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`

  if (!task) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <p style={{ color: 'rgba(245,243,238,0.5)' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.88)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
            <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/dashboard/tasks" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13 }}>← Back to Tasks</Link>
            <Link href="/pricing" style={{ color: '#f0c040', textDecoration: 'none', fontSize: 13, padding: '6px 14px', border: '1px solid rgba(240,192,64,0.3)', borderRadius: 8 }}>⚡ Upgrade Plan</Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: '100px 5% 60px', maxWidth: 820, margin: '0 auto' }}>
        {/* Plan Badge */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <span className="pill" style={{ background: userPlan === 'FREE' ? 'rgba(136,136,136,0.1)' : userPlan === 'MEDIUM' ? 'rgba(0,229,255,0.1)' : 'rgba(240,192,64,0.1)', color: userPlan === 'FREE' ? '#888' : userPlan === 'MEDIUM' ? '#00e5ff' : '#f0c040', fontSize: 11 }}>
            {userPlan === 'FREE' ? '🆓 Free Plan' : userPlan === 'MEDIUM' ? '⚡ Medium Plan' : '👑 Premium Plan'}
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <span className="pill" style={{ background: `${diffColors[task.difficulty]}18`, color: diffColors[task.difficulty] }}>{task.difficulty}</span>
          <span className="pill" style={{ background: 'rgba(240,192,64,0.1)', color: '#f0c040' }}>{task.category}</span>
          {task.location && <span className="pill" style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(245,243,238,0.5)', border: '1px solid var(--border)' }}>📍 {task.location}</span>}
        </div>

        <h1 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 28, marginBottom: 8 }}>{task.title}</h1>
        <p style={{ fontSize: 14, color: 'rgba(245,243,238,0.5)', marginBottom: 28 }}>Posted by <strong style={{ color: '#f5f3ee' }}>{task.postedBy?.name}</strong></p>

        {/* Description */}
        <div className="card-glass" style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Task Brief</h3>
          <p style={{ color: 'rgba(245,243,238,0.6)', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{task.description}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          <div className="card-glass" style={{ textAlign: 'center', padding: 18 }}>
            <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 22, color: '#f0c040' }}>₹{task.reward}</div>
            <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.5)' }}>Reward</div>
          </div>
          <div className="card-glass" style={{ textAlign: 'center', padding: 18 }}>
            <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 22, color: '#00e5ff' }}>+{task.xpReward}</div>
            <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.5)' }}>XP Reward</div>
          </div>
          <div className="card-glass" style={{ textAlign: 'center', padding: 18 }}>
            <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 22, color: '#f5f3ee' }}>{task._count?.submissions || 0}</div>
            <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.5)' }}>Submissions</div>
          </div>
        </div>

        {/* Skills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {task.skills?.split(',').map((s: string) => (
            <span key={s} className="pill" style={{ background: 'rgba(240,192,64,0.08)', color: '#f0c040', border: '1px solid rgba(240,192,64,0.2)', fontSize: 12 }}>{s.trim()}</span>
          ))}
        </div>

        {/* Submission Panel */}
        {submitted ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: 48, borderColor: 'rgba(74,222,128,0.3)' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
            <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 24, marginBottom: 10 }}>Work Submitted!</h3>
            <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14, marginBottom: 24 }}>Your submission is under review. You'll earn XP when approved!</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/dashboard/tasks" className="btn-gold" style={{ textDecoration: 'none' }}>Browse More Tasks</Link>
              <Link href="/dashboard/wallet" className="btn-ghost" style={{ textDecoration: 'none' }}>View Wallet</Link>
            </div>
          </div>
        ) : alreadySubmitted ? (
          <div className="card-glass" style={{ textAlign: 'center', padding: 36, borderColor: 'rgba(0,229,255,0.2)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <p style={{ color: 'rgba(245,243,238,0.6)', fontSize: 14 }}>You already submitted work for this task. Check your <Link href="/dashboard/wallet" style={{ color: '#f0c040' }}>Skill Wallet</Link> for status.</p>
          </div>
        ) : isFreeLimited ? (
          /* Upgrade gate for FREE plan */
          <div className="card-glass" style={{ padding: 36, borderColor: 'rgba(240,192,64,0.3)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 300, height: 300, transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(240,192,64,0.08), transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ fontSize: 44, marginBottom: 16 }}>🔒</div>
            <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 22, marginBottom: 10 }}>Free Plan Limit Reached</h3>
            <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
              Your <strong style={{ color: '#888' }}>Free Plan</strong> includes <strong style={{ color: '#f0c040' }}>1 internship submission</strong>.<br />
              Upgrade to continue submitting and unlock unlimited tasks.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
              <Link href="/pricing" className="btn-gold" style={{ textDecoration: 'none', fontSize: 15, padding: '12px 28px' }}>⚡ Upgrade Plan →</Link>
              <Link href="/dashboard" className="btn-ghost" style={{ textDecoration: 'none' }}>Back to Dashboard</Link>
            </div>
            <div style={{ marginTop: 20, display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', fontSize: 12, color: 'rgba(245,243,238,0.35)' }}>
              <span>⚡ Medium — ₹99/mo · 10 tasks</span>
              <span>👑 Premium — ₹199/mo · Unlimited</span>
            </div>
          </div>
        ) : (
          <div className="card-glass" style={{ borderColor: 'rgba(240,192,64,0.2)' }}>
            <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>📤 Submit Your Work</h3>
            <p style={{ fontSize: 12, color: 'rgba(245,243,238,0.4)', marginBottom: 18 }}>
              You can attach photos and videos as proof of your completed work (max 3 files).
            </p>
            {error && <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: 10, padding: '10px 16px', marginBottom: 14, color: '#ff4d6d', fontSize: 13 }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              {/* Text area */}
              <textarea
                className="input-dark"
                style={{ minHeight: 140, resize: 'vertical', marginBottom: 16 }}
                placeholder="Describe your work in detail — paste links, explain your approach, list deliverables..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />

              {/* File Upload Zone */}
              <div
                style={{ border: '2px dashed rgba(240,192,64,0.25)', borderRadius: 14, padding: '20px', marginBottom: 16, textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s, background 0.2s', background: 'rgba(240,192,64,0.02)' }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); (e.currentTarget as HTMLElement).style.borderColor = '#f0c040'; (e.currentTarget as HTMLElement).style.background = 'rgba(240,192,64,0.06)' }}
                onDragLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,192,64,0.25)'; (e.currentTarget as HTMLElement).style.background = 'rgba(240,192,64,0.02)' }}
                onDrop={async (e) => {
                  e.preventDefault()
                  const files = Array.from(e.dataTransfer.files)
                  if (files.length) {
                    const input = fileInputRef.current
                    if (input) {
                      const dt = new DataTransfer()
                      files.forEach(f => dt.items.add(f))
                      input.files = dt.files
                      await handleFileUpload({ target: input } as any)
                    }
                  }
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
                <div style={{ fontSize: 13, color: 'rgba(245,243,238,0.6)', marginBottom: 4 }}>
                  {uploading ? '⏳ Uploading...' : 'Click or drag & drop files here'}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.3)' }}>
                  📸 Images (JPG, PNG, WebP) · 🎬 Videos (MP4, WebM, MOV) · Max 3 files
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  disabled={uploading || uploadedFiles.length >= 3}
                />
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {uploadedFiles.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
                      <span style={{ fontSize: 20 }}>{f.type === 'video' ? '🎬' : '🖼️'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: '#f5f3ee', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                        <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.4)' }}>{f.type === 'video' ? 'Video' : 'Image'} · {formatSize(f.size)}</div>
                      </div>
                      {/* Preview */}
                      {f.type === 'image' && (
                        <img src={f.url} alt={f.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                      )}
                      {f.type === 'video' && (
                        <video src={f.url} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 8 }} muted />
                      )}
                      <button type="button" onClick={() => removeFile(f.url)} style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: 8, padding: '4px 10px', color: '#ff4d6d', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="submit" className="btn-gold" disabled={submitting || uploading} style={{ padding: '12px 28px' }}>
                  {submitting ? '⏳ Submitting...' : '🚀 Submit Work'}
                </button>
                {uploadedFiles.length === 0 && (
                  <span style={{ fontSize: 12, color: 'rgba(245,243,238,0.3)' }}>Tip: Add photos/videos to strengthen your submission</span>
                )}
                {uploadedFiles.length > 0 && (
                  <span style={{ fontSize: 12, color: '#4ade80' }}>✓ {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} attached</span>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
