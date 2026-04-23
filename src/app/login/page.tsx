'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) { setError('Invalid email or password'); return }
    const session = await fetch('/api/auth/session').then(r => r.json())
    if (session?.user?.role === 'BUSINESS') router.push('/business')
    else router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>

      {/* ── Colorful animated BG image + gradient ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Image src="/hero_banner.png" alt="bg" fill style={{ objectFit: 'cover', opacity: 0.18 }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0a0020 0%, #1a003a 30%, #001030 60%, #0a0a0f 100%)' }} />
        {/* animated orbs */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,60,255,0.35), transparent 70%)', top: '-120px', left: '-120px', filter: 'blur(70px)', animation: 'loginOrb1 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,192,64,0.28), transparent 70%)', bottom: '-80px', right: '-80px', filter: 'blur(60px)', animation: 'loginOrb2 15s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.22), transparent 70%)', top: '40%', right: '10%', filter: 'blur(50px)', animation: 'loginOrb3 10s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,110,247,0.25), transparent 70%)', bottom: '25%', left: '8%', filter: 'blur(50px)', animation: 'loginOrb1 18s ease-in-out infinite reverse' }} />
        {/* grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      {/* ── Login card ── */}
      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800, fontSize: 36, margin: 0 }}>
              <span style={{ color: '#f5f3ee' }}>Skill</span>
              <span style={{ background: 'linear-gradient(90deg,#f0c040,#ff6ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Drop</span>
            </h1>
          </Link>
          <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14, marginTop: 8 }}>Welcome back! Sign in to continue.</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.13)',
          borderRadius: 24,
          padding: '40px 36px',
          backdropFilter: 'blur(28px)',
          boxShadow: '0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}>

          {/* Social-style decorative bar */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {['#f0c040','#ff6ef7','#00e5ff','#4ade80'].map(c => (
              <div key={c} style={{ flex: 1, height: 3, borderRadius: 99, background: c, opacity: 0.7 }} />
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, color: 'rgba(245,243,238,0.55)', marginBottom: 7, display: 'block', fontWeight: 500 }}>Email</label>
              <input
                className="input-dark"
                type="email"
                placeholder="priya@test.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ borderRadius: 12 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, color: 'rgba(245,243,238,0.55)', marginBottom: 7, display: 'block', fontWeight: 500 }}>Password</label>
              <input
                className="input-dark"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ borderRadius: 12 }}
              />
            </div>
            {error && (
              <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: 10, padding: '10px 14px', color: '#ff4d6d', fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}
            <button
              type="submit"
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', marginTop: 6, padding: '14px', fontSize: 15, borderRadius: 12 }}
              disabled={loading}
            >
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: 12, color: 'rgba(245,243,238,0.3)' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(245,243,238,0.5)', margin: 0 }}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" style={{ color: '#f0c040', textDecoration: 'none', fontWeight: 600 }}>Sign up free →</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, backdropFilter: 'blur(10px)' }}>
          <p style={{ fontSize: 11, color: 'rgba(245,243,238,0.35)', margin: 0, textAlign: 'center', lineHeight: 1.7 }}>
            🎓 <strong style={{ color: 'rgba(245,243,238,0.5)' }}>Student:</strong> priya@test.com / password123
            <br />
            🏢 <strong style={{ color: 'rgba(245,243,238,0.5)' }}>Business:</strong> cafe@test.com / password123
          </p>
        </div>
      </div>

      <style>{`
        @keyframes loginOrb1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(40px,-30px) scale(1.1)}}
        @keyframes loginOrb2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-30px,40px) scale(1.08)}}
        @keyframes loginOrb3{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,20px)}}
      `}</style>
    </div>
  )
}
