'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const PLAN_DETAILS: Record<string, { name: string; icon: string; price: string; color: string; perks: string[] }> = {
  MEDIUM: {
    name: 'Medium Plan',
    icon: '⚡',
    price: '₹99/month',
    color: '#00e5ff',
    perks: ['10 task submissions/month', 'Photo & video uploads', 'AI Mentor (50 msgs)', 'Priority applications', 'Verified profile badge'],
  },
  PREMIUM: {
    name: 'Premium Plan',
    icon: '👑',
    price: '₹199/month',
    color: '#f0c040',
    perks: ['Unlimited submissions', 'Photo & video uploads', 'AI Mentor (unlimited)', 'Priority applications', 'Featured on business discovery', 'Career coach sessions'],
  },
}

const DUMMY_CARDS = [
  { last4: '4242', brand: 'Visa', expiry: '12/27' },
  { last4: '5353', brand: 'Mastercard', expiry: '09/26' },
  { last4: '1111', brand: 'RuPay', expiry: '03/28' },
]

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const planKey = (searchParams.get('plan') || 'MEDIUM').toUpperCase()
  const plan = PLAN_DETAILS[planKey] || PLAN_DETAILS.MEDIUM

  const [step, setStep] = useState<'select' | 'payment' | 'processing' | 'success'>('select')
  const [selectedCard, setSelectedCard] = useState(0)
  const [upiId, setUpiId] = useState('')
  const [payMethod, setPayMethod] = useState<'card' | 'upi' | 'netbanking'>('card')
  const [error, setError] = useState('')

  const handlePay = async () => {
    setError('')
    if (payMethod === 'upi' && !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. name@upi)')
      return
    }
    setStep('processing')
    // Simulate payment processing delay
    await new Promise(r => setTimeout(r, 2200))
    // Call real API to update plan in DB
    await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey }),
    })
    setStep('success')
  }

  if (step === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(74,222,128,0.2), rgba(74,222,128,0.05))', border: '2px solid rgba(74,222,128,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42, margin: '0 auto 24px' }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 28, marginBottom: 10, color: '#4ade80' }}>Payment Successful!</h2>
          <p style={{ color: 'rgba(245,243,238,0.55)', fontSize: 14, marginBottom: 8 }}>
            You're now on the <strong style={{ color: plan.color }}>{plan.name}</strong>.
          </p>
          <p style={{ color: 'rgba(245,243,238,0.4)', fontSize: 13, marginBottom: 32 }}>Your plan is active. Start submitting tasks with photos & videos!</p>
          <div style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 14, padding: '16px 24px', marginBottom: 28 }}>
            <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.4)', marginBottom: 8 }}>What's unlocked:</div>
            {plan.perks.map((p, i) => (
              <div key={i} style={{ fontSize: 13, color: 'rgba(245,243,238,0.7)', marginBottom: 4 }}>✓ {p}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/dashboard/tasks" className="btn-gold" style={{ textDecoration: 'none' }}>Browse Tasks →</Link>
            <Link href="/dashboard" className="btn-ghost" style={{ textDecoration: 'none' }}>Dashboard</Link>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'processing') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        <div style={{ width: 60, height: 60, border: '3px solid rgba(240,192,64,0.15)', borderTop: '3px solid #f0c040', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 18 }}>Processing payment...</div>
        <div style={{ fontSize: 13, color: 'rgba(245,243,238,0.4)' }}>Please don't close this window</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '100px 5% 60px' }}>
      <div style={{ maxWidth: 880, width: '100%', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28 }}>
        {/* Left — Payment Form */}
        <div>
          <h1 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 26, marginBottom: 4 }}>Complete Your Order</h1>
          <p style={{ color: 'rgba(245,243,238,0.4)', fontSize: 13, marginBottom: 28 }}>Secure checkout — your data is encrypted</p>

          {/* Payment Method Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 4 }}>
            {(['card', 'upi', 'netbanking'] as const).map(m => (
              <button key={m} onClick={() => setPayMethod(m)} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: '0.2s', background: payMethod === m ? 'rgba(240,192,64,0.15)' : 'transparent', color: payMethod === m ? '#f0c040' : 'rgba(245,243,238,0.4)' }}>
                {m === 'card' ? '💳 Card' : m === 'upi' ? '📱 UPI' : '🏦 Net Banking'}
              </button>
            ))}
          </div>

          {payMethod === 'card' && (
            <div>
              <div style={{ fontSize: 13, color: 'rgba(245,243,238,0.4)', marginBottom: 14 }}>Select a card (demo)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {DUMMY_CARDS.map((card, i) => (
                  <div key={i} onClick={() => setSelectedCard(i)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, border: `1px solid ${selectedCard === i ? 'rgba(240,192,64,0.4)' : 'var(--border)'}`, background: selectedCard === i ? 'rgba(240,192,64,0.06)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selectedCard === i ? '#f0c040' : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selectedCard === i && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f0c040' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{card.brand} •••• {card.last4}</div>
                      <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.4)' }}>Expires {card.expiry}</div>
                    </div>
                    <span style={{ fontSize: 20 }}>{card.brand === 'Visa' ? '💳' : card.brand === 'Mastercard' ? '🔴' : '🟦'}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.25)', marginBottom: 20 }}>🔒 Demo mode — no real card charged</div>
            </div>
          )}

          {payMethod === 'upi' && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: 'rgba(245,243,238,0.5)', marginBottom: 8, display: 'block' }}>UPI ID</label>
              <input className="input-dark" placeholder="yourname@paytm / @gpay / @upi" value={upiId} onChange={e => setUpiId(e.target.value)} style={{ marginBottom: 10 }} />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['@paytm', '@gpay', '@okaxis', '@upi'].map(suffix => (
                  <button key={suffix} onClick={() => setUpiId(`demo${suffix}`)} style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'transparent', color: 'rgba(245,243,238,0.5)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{suffix}</button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.25)', marginTop: 12 }}>🔒 Demo mode — no real UPI transaction</div>
            </div>
          )}

          {payMethod === 'netbanking' && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: 'rgba(245,243,238,0.4)', marginBottom: 14 }}>Select your bank (demo)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(bank => (
                  <div key={bank} style={{ padding: '14px', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center', cursor: 'pointer', fontSize: 13, color: 'rgba(245,243,238,0.6)', transition: '0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#f0c040')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    🏦 {bank}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.25)', marginTop: 12 }}>🔒 Demo mode — no real bank redirected</div>
            </div>
          )}

          {error && <div style={{ background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)', borderRadius: 10, padding: '10px 16px', marginBottom: 14, color: '#ff4d6d', fontSize: 13 }}>{error}</div>}

          <button className="btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }} onClick={handlePay}>
            {plan.icon} Pay {plan.price}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 12, fontSize: 12, color: 'rgba(245,243,238,0.25)' }}>
            🔒 256-bit SSL encryption · Demo payment simulation
          </div>
        </div>

        {/* Right — Order Summary */}
        <div>
          <div className="card-glass" style={{ padding: 24, borderColor: plan.color.replace(')', ', 0.3)').replace('rgb', 'rgba').replace('#', 'rgba(') || 'rgba(240,192,64,0.3)', position: 'sticky', top: 100 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(245,243,238,0.4)', marginBottom: 16 }}>ORDER SUMMARY</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 32 }}>{plan.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 18, color: plan.color }}>{plan.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.4)' }}>Monthly subscription</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 16 }}>
              {plan.perks.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'rgba(245,243,238,0.6)' }}>
                  <span style={{ color: '#4ade80' }}>✓</span> {p}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(245,243,238,0.5)', marginBottom: 8 }}>
                <span>Subtotal</span><span>{plan.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(245,243,238,0.5)', marginBottom: 12 }}>
                <span>GST (18%)</span><span>₹{planKey === 'MEDIUM' ? '17.82' : '35.82'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 18 }}>
                <span>Total</span>
                <span style={{ color: plan.color }}>{planKey === 'MEDIUM' ? '₹116.82' : '₹234.82'}</span>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(74,222,128,0.06)', borderRadius: 10, border: '1px solid rgba(74,222,128,0.15)', fontSize: 12, color: '#4ade80' }}>
              ✓ Cancel anytime · No lock-in period
            </div>
            <div style={{ marginTop: 10, textAlign: 'center' }}>
              <Link href="/pricing" style={{ fontSize: 12, color: 'rgba(245,243,238,0.3)', textDecoration: 'none' }}>← Back to Pricing</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.88)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
            <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(245,243,238,0.4)' }}>
            🔒 Secure Checkout
          </div>
        </div>
      </nav>
      <Suspense fallback={<div style={{ padding: '200px 0', textAlign: 'center', color: 'rgba(245,243,238,0.4)' }}>Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}
