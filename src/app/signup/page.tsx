'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STUDENT')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, role }) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Signup failed'); setLoading(false); return }
    // Auto login
    await signIn('credentials', { email, password, redirect: false })
    router.push(role === 'BUSINESS' ? '/business' : '/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', zIndex: 1 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800, fontSize: 32 }}>
              <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span>
            </h1>
          </Link>
          <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14, marginTop: 8 }}>Create your account</p>
        </div>
        <div className="card-glass" style={{ padding: 32 }}>
          {/* Role Toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4 }}>
            <button onClick={() => setRole('STUDENT')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', background: role === 'STUDENT' ? '#f0c040' : 'transparent', color: role === 'STUDENT' ? '#0a0a0f' : 'rgba(245,243,238,0.5)', transition: '0.3s' }}>
              🎓 Student
            </button>
            <button onClick={() => setRole('BUSINESS')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', background: role === 'BUSINESS' ? '#f0c040' : 'transparent', color: role === 'BUSINESS' ? '#0a0a0f' : 'rgba(245,243,238,0.5)', transition: '0.3s' }}>
              🏢 Business
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, color: 'rgba(245,243,238,0.5)', marginBottom: 6, display: 'block' }}>{role === 'BUSINESS' ? 'Business Name' : 'Full Name'}</label>
              <input className="input-dark" placeholder={role === 'BUSINESS' ? 'Cafe Aroma' : 'Priya Sharma'} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'rgba(245,243,238,0.5)', marginBottom: 6, display: 'block' }}>Email</label>
              <input className="input-dark" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'rgba(245,243,238,0.5)', marginBottom: 6, display: 'block' }}>Password</label>
              <input className="input-dark" type="password" placeholder="Min 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            </div>
            {error && <p style={{ color: '#ff4d6d', fontSize: 13 }}>{error}</p>}
            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} disabled={loading}>
              {loading ? 'Creating...' : `Create ${role === 'BUSINESS' ? 'Business' : 'Student'} Account`}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(245,243,238,0.5)', marginTop: 20 }}>
            Already have an account? <Link href="/login" style={{ color: '#f0c040', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
