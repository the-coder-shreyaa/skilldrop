'use client'
import Link from 'next/link'
import { useState } from 'react'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    icon: '🆓',
    price: '₹0',
    period: 'forever',
    color: '#888',
    border: 'rgba(136,136,136,0.25)',
    glow: 'rgba(136,136,136,0.06)',
    badge: null,
    tagline: 'Get started with your first internship',
    features: [
      { text: '1 internship submission', included: true },
      { text: 'Basic Skill Wallet', included: true },
      { text: 'Public Leaderboard access', included: true },
      { text: 'Text-only submissions', included: true },
      { text: 'Photo & video proof uploads', included: false },
      { text: 'AI Mentor access', included: false },
      { text: 'Badge collection', included: false },
      { text: 'Priority task applications', included: false },
      { text: 'Unlimited submissions', included: false },
    ],
    cta: 'Get Started Free',
    ctaStyle: 'ghost',
    href: '/signup',
  },
  {
    id: 'medium',
    name: 'Medium',
    icon: '⚡',
    price: '₹99',
    period: 'per month',
    color: '#00e5ff',
    border: 'rgba(0,229,255,0.35)',
    glow: 'rgba(0,229,255,0.06)',
    badge: 'Most Popular',
    tagline: 'For students serious about their career',
    features: [
      { text: '10 internship submissions/month', included: true },
      { text: 'Full Skill Wallet + badges', included: true },
      { text: 'Public Leaderboard + rank badge', included: true },
      { text: 'Photo & video proof uploads', included: true },
      { text: 'AI Mentor (50 messages/month)', included: true },
      { text: 'Priority task applications', included: true },
      { text: 'Verified profile badge', included: true },
      { text: 'Unlimited submissions', included: false },
      { text: 'Dedicated career coach', included: false },
    ],
    cta: 'Start Medium Plan',
    ctaStyle: 'cyan',
    href: '/checkout?plan=medium',
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: '👑',
    price: '₹199',
    period: 'per month',
    color: '#f0c040',
    border: 'rgba(240,192,64,0.4)',
    glow: 'rgba(240,192,64,0.08)',
    badge: 'Best Value',
    tagline: 'Unlimited access for ambitious students',
    features: [
      { text: 'Unlimited submissions', included: true },
      { text: 'Full Skill Wallet + all badges', included: true },
      { text: 'Leaderboard + #1 spotlight', included: true },
      { text: 'Photo & video proof uploads', included: true },
      { text: 'AI Mentor (unlimited)', included: true },
      { text: 'Priority task applications', included: true },
      { text: 'Verified + Premium profile badge', included: true },
      { text: 'Dedicated career coach sessions', included: true },
      { text: 'Featured on business discovery', included: true },
    ],
    cta: 'Go Premium',
    ctaStyle: 'gold',
    href: '/checkout?plan=premium',
  },
]

const FAQ = [
  { q: 'Can I cancel anytime?', a: 'Yes — cancel anytime from your account settings. No lock-ins, no questions asked.' },
  { q: 'What counts as a submission?', a: 'Each time you submit work to a task listing counts as one submission. Drafts or edits to the same task do not count.' },
  { q: 'What file types can I upload?', a: 'Photos: JPG, PNG, WebP (up to 10MB). Videos: MP4, WebM, MOV (up to 50MB). Maximum 3 files per submission.' },
  { q: 'Does the free plan expire?', a: 'No. Your free plan never expires — you keep your 1 submission slot and your Skill Wallet forever.' },
  { q: 'Can businesses see my plan?', a: 'Businesses can see your verified badge tier (Free/Medium/Premium) on your profile as a trust signal.' },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.88)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
            <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/dashboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13 }}>Dashboard</Link>
            <Link href="/signup" className="btn-gold" style={{ textDecoration: 'none', padding: '8px 20px', fontSize: 13 }}>Get Started</Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: '110px 5% 80px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="sec-label">Pricing</span>
          <h1 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 60px)', marginBottom: 16 }}>
            <span style={{ color: '#f5f3ee' }}>Start free. </span>
            <span style={{ color: '#f0c040' }}>Scale your career.</span>
          </h1>
          <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 16, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Your first internship is on us — no card required. Upgrade when you're ready to go full speed.
          </p>

          {/* Free callout */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 24, padding: '10px 24px', borderRadius: 999, background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80', fontSize: 13 }}>
            <span style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', display: 'inline-block' }} />
            ✓ No credit card required for Free plan
          </div>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 80 }}>
          {PLANS.map((plan, i) => (
            <div key={plan.id} style={{ position: 'relative' }}>
              {/* Popular badge */}
              {plan.badge && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: plan.color, color: '#0a0a0f', fontSize: 11, fontWeight: 800, padding: '4px 16px', borderRadius: 999, letterSpacing: 1, whiteSpace: 'nowrap', zIndex: 1 }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ padding: 32, borderRadius: 20, border: `1px solid ${plan.border}`, background: `linear-gradient(135deg, ${plan.glow}, rgba(10,10,15,0.6))`, backdropFilter: 'blur(12px)', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                {/* Glow orb */}
                <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${plan.color}18, transparent 70%)`, pointerEvents: 'none' }} />

                {/* Plan header */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 28 }}>{plan.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 18, color: plan.color }}>{plan.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.4)' }}>{plan.tagline}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 42, color: '#f5f3ee' }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: 'rgba(245,243,238,0.4)' }}>/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: f.included ? 1 : 0.35 }}>
                      <span style={{ fontSize: 14, color: f.included ? '#4ade80' : '#666', flexShrink: 0 }}>{f.included ? '✓' : '✕'}</span>
                      <span style={{ fontSize: 13, color: f.included ? 'rgba(245,243,238,0.8)' : 'rgba(245,243,238,0.4)', textDecoration: f.included ? 'none' : 'none' }}>{f.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={plan.href}
                  style={{
                    display: 'block', textAlign: 'center', padding: '14px 0', borderRadius: 12, textDecoration: 'none',
                    fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                    ...(plan.ctaStyle === 'gold'
                      ? { background: 'linear-gradient(135deg, #f0c040, #ffd060)', color: '#0a0a0f' }
                      : plan.ctaStyle === 'cyan'
                      ? { background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.4)', color: '#00e5ff' }
                      : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,243,238,0.6)' })
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Note */}
        <div style={{ textAlign: 'center', marginBottom: 72, padding: '32px', background: 'rgba(240,192,64,0.04)', border: '1px solid rgba(240,192,64,0.15)', borderRadius: 20 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎬</div>
          <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 18, marginBottom: 10 }}>Real proof. Real work.</h3>
          <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 14, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Medium and Premium users can upload <strong style={{ color: '#f0c040' }}>photos and videos</strong> with their submissions — giving businesses real evidence of your skills. No more just talking about what you can do.
          </p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap', fontSize: 13, color: 'rgba(245,243,238,0.5)' }}>
            <span>📸 Design screenshots</span>
            <span>🎬 Walkthrough videos</span>
            <span>📊 Data reports</span>
            <span>🎨 Artwork files</span>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 28, textAlign: 'center', marginBottom: 36 }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map((item, i) => (
              <div key={i} className="card-glass" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px' }}>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{item.q}</span>
                  <span style={{ color: '#f0c040', fontSize: 16, transition: '0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                </div>
                {openFaq === i && (
                  <div style={{ padding: '0 22px 18px', color: 'rgba(245,243,238,0.55)', fontSize: 13, lineHeight: 1.7, borderTop: '1px solid var(--border)' }}>
                    <div style={{ paddingTop: 14 }}>{item.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <p style={{ color: 'rgba(245,243,238,0.4)', fontSize: 14, marginBottom: 20 }}>Still not sure? Start free — no card needed.</p>
          <Link href="/signup" className="btn-gold" style={{ textDecoration: 'none', fontSize: 15, padding: '14px 40px' }}>
            🚀 Get Started Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 5%', marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 16, color: '#f0c040' }}>SkillDrop</div>
          <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'rgba(245,243,238,0.4)' }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
            <Link href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Login</Link>
            <Link href="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>Sign Up</Link>
          </div>
          <div style={{ color: 'rgba(245,243,238,0.3)', fontSize: 12 }}>© 2025 SkillDrop · Built for Bharat 🇮🇳</div>
        </div>
      </footer>
    </div>
  )
}
