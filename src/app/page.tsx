'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const { data: session } = useSession()
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Animated colorful background orbs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
        <div className="orb orb4" />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(24px)', background: 'rgba(10,10,15,0.82)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800, fontSize: 22, textDecoration: 'none' }}>
            <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ background: 'linear-gradient(90deg,#f0c040,#ff6ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Drop</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/pricing" style={{ color: 'rgba(245,243,238,0.6)', textDecoration: 'none', fontSize: 14, transition: '0.2s' }}>Pricing</Link>
            <Link href="/login" style={{ color: 'rgba(245,243,238,0.6)', textDecoration: 'none', fontSize: 14, transition: '0.2s' }}>Login</Link>
            <Link href="/signup" className="btn-gold" style={{ textDecoration: 'none', fontSize: 13, padding: '9px 22px' }}>Get Started →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 5% 60px', position: 'relative', overflow: 'hidden' }}>
        {/* hero bg image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image src="/hero_banner.png" alt="SkillDrop hero" fill style={{ objectFit: 'cover', opacity: 0.22 }} priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(10,10,15,0.98) 38%, rgba(30,10,60,0.7) 70%, rgba(10,10,15,0.5) 100%)' }} />
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 48 }}>
          {/* LEFT text */}
          <div style={{ flex: '1 1 500px', minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 999, border: '1px solid rgba(240,192,64,0.3)', background: 'rgba(240,192,64,0.07)', fontSize: 13, color: '#f0c040', marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, background: '#f0c040', borderRadius: '50%', display: 'inline-block', animation: 'blink 1.3s infinite' }} /> 🚀 India&apos;s First Proof-of-Work Platform
            </div>
            <h1 style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.9, marginBottom: 22 }}>
              <span style={{ color: '#f5f3ee' }}>SKILL</span><br />
              <span style={{ background: 'linear-gradient(135deg,#f0c040 0%,#ff6ef7 60%,#00e5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DROP</span>
              <span style={{ fontSize: '0.37em', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 300, opacity: 0.35, display: 'block', marginTop: 14, lineHeight: 1.4, WebkitTextFillColor: '#f5f3ee' }}>No Resume. Only Proof of Work.</span>
            </h1>
            <p style={{ color: 'rgba(245,243,238,0.6)', fontSize: 17, lineHeight: 1.78, marginBottom: 36, fontWeight: 300, maxWidth: 520 }}>
              A platform that transforms resume-based hiring into a real-time Proof-of-Skill economy — connecting India&apos;s students with businesses through verified work.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
              <Link href="/signup" className="btn-gold" style={{ textDecoration: 'none', fontSize: 15, padding: '14px 32px' }}>Start Earning Free →</Link>
              <Link href="/signup?role=business" className="btn-ghost" style={{ textDecoration: 'none', fontSize: 15, padding: '14px 32px' }}>For Businesses</Link>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <div><div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, color: '#f0c040' }}>50M+</div><div style={{ fontSize: 12, color: 'rgba(245,243,238,0.4)' }}>Students</div></div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <div><div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, color: '#ff6ef7' }}>63M+</div><div style={{ fontSize: 12, color: 'rgba(245,243,238,0.4)' }}>MSMEs</div></div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <div><div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, color: '#00e5ff' }}>Tier 2/3</div><div style={{ fontSize: 12, color: 'rgba(245,243,238,0.4)' }}>Bharat Focus</div></div>
            </div>
          </div>

          {/* RIGHT — 3D image */}
          <div className="hero-3d-wrapper" style={{ flex: '0 0 auto', width: 'clamp(280px, 38vw, 520px)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* glow behind */}
            <div style={{ position: 'absolute', width: '80%', height: '80%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,80,255,0.35) 0%, rgba(0,229,255,0.15) 50%, transparent 70%)', filter: 'blur(40px)', animation: 'pulse3d 4s ease-in-out infinite' }} />
            <Image
              src="/hero_3d.png"
              alt="SkillDrop 3D visual"
              width={520}
              height={520}
              style={{ width: '100%', height: 'auto', objectFit: 'contain', animation: 'float3d 6s ease-in-out infinite', filter: 'drop-shadow(0 0 60px rgba(180,80,255,0.5)) drop-shadow(0 0 30px rgba(0,229,255,0.3))', position: 'relative', zIndex: 1 }}
              priority
            />
            {/* floating badge 1 */}
            <div style={{ position: 'absolute', top: '12%', right: '-5%', padding: '10px 18px', background: 'rgba(240,192,64,0.12)', border: '1px solid rgba(240,192,64,0.4)', borderRadius: 12, backdropFilter: 'blur(12px)', animation: 'floatBadge1 5s ease-in-out infinite', zIndex: 2 }}>
              <div style={{ fontSize: 11, color: '#f0c040', fontWeight: 600 }}>⚡ Task Verified</div>
              <div style={{ fontSize: 10, color: 'rgba(245,243,238,0.5)', marginTop: 2 }}>Skill Score +12</div>
            </div>
            {/* floating badge 2 */}
            <div style={{ position: 'absolute', bottom: '18%', left: '-8%', padding: '10px 18px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.35)', borderRadius: 12, backdropFilter: 'blur(12px)', animation: 'floatBadge2 6s ease-in-out infinite', zIndex: 2 }}>
              <div style={{ fontSize: 11, color: '#00e5ff', fontWeight: 600 }}>🏆 Badge Earned</div>
              <div style={{ fontSize: 10, color: 'rgba(245,243,238,0.5)', marginTop: 2 }}>React Developer</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 5%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="sec-label">How It Works</span>
          <h2 className="sec-title" style={{ marginBottom: 48 }}>From zero to hired — in 4 steps</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {[
              { icon: '🎯', title: 'Set Skill Path', desc: 'Choose career goal, get personalized roadmap from AI Mentor', color: '#f0c040' },
              { icon: '📋', title: 'Pick a Micro-Task', desc: 'Browse real tasks from verified local businesses', color: '#ff6ef7' },
              { icon: '🚀', title: 'Submit Real Work', desc: 'Complete task, upload proof, get reviewed and rated', color: '#00e5ff' },
              { icon: '✅', title: 'Get Shortlisted', desc: 'Skill score builds, businesses hire you directly', color: '#4ade80' },
            ].map((s, i) => (
              <div key={i} className="card-glass step-card" style={{ textAlign: 'center', padding: 32, borderTop: `2px solid ${s.color}55` }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 11, letterSpacing: 2, color: s.color, marginBottom: 8 }}>STEP {i + 1}</div>
                <h3 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 13, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TASK CATEGORIES ── */}
      <section style={{ padding: '60px 5% 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span className="sec-label">Task Categories</span>
          <h2 className="sec-title" style={{ marginBottom: 48 }}>Real tasks across every skill</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { image: '/cat_design.png', label: 'Design', tasks: '24 open tasks', color: '#b86cf5', desc: 'Figma, Canva, Branding, UI/UX' },
              { image: '/cat_dev.png', label: 'Development', tasks: '18 open tasks', color: '#00e5ff', desc: 'React, Next.js, Python, APIs' },
              { image: '/cat_writing.png', label: 'Writing & Marketing', tasks: '31 open tasks', color: '#f0c040', desc: 'Content, Captions, SEO, Ads' },
            ].map((cat, i) => (
              <Link href="/signup" key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-glass" style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative', minHeight: 200 }}>
                  <div style={{ position: 'absolute', inset: 0 }}>
                    <Image src={cat.image} alt={cat.label} fill style={{ objectFit: 'cover', opacity: 0.5 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,1) 40%, rgba(10,10,15,0.3) 100%)' }} />
                  </div>
                  <div style={{ position: 'relative', zIndex: 1, padding: '140px 24px 24px' }}>
                    <span className="pill" style={{ background: `${cat.color}18`, color: cat.color, border: `1px solid ${cat.color}33`, fontSize: 11, marginBottom: 8 }}>{cat.tasks}</span>
                    <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, marginBottom: 4 }}>{cat.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(245,243,238,0.5)' }}>{cat.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PLANS ── */}
      <section style={{ padding: '80px 5% 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 700, height: 700, transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(180,80,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span className="sec-label">Pricing</span>
          <h2 className="sec-title" style={{ marginBottom: 12 }}>Simple, transparent plans</h2>
          <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 15, marginBottom: 56 }}>Start free, upgrade when you&apos;re ready to unlock premium features.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 24, alignItems: 'stretch' }}>
            {/* Free */}
            <div className="card-glass plan-card" style={{ padding: 36, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#4ade80', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Free</div>
                <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 44 }}>₹0<span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(245,243,238,0.4)' }}>/mo</span></div>
                <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 13, marginTop: 8 }}>Perfect to get started and prove your skills.</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {['5 task submissions/month', 'Basic skill badge', 'Community leaderboard', 'Email support'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(245,243,238,0.75)', alignItems: 'center' }}>
                    <span style={{ color: '#4ade80', fontSize: 16 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-ghost" style={{ textDecoration: 'none', textAlign: 'center', width: '100%', justifyContent: 'center', display: 'inline-block', padding: '13px 0' }}>Get Started Free</Link>
            </div>

            {/* Pro — highlighted */}
            <div className="plan-card plan-pro" style={{ padding: 36, display: 'flex', flexDirection: 'column', gap: 20, borderRadius: 20, border: '2px solid rgba(240,192,64,0.5)', background: 'rgba(240,192,64,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg,#f0c040,#ff6ef7)', fontSize: 11, fontWeight: 700, padding: '6px 18px', borderBottomLeftRadius: 12, color: '#0a0a0f' }}>MOST POPULAR</div>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(240,192,64,0.08), transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f0c040', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Pro</div>
                <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 44 }}>₹299<span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(245,243,238,0.4)' }}>/mo</span></div>
                <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 13, marginTop: 8 }}>For serious students ready to land real opportunities.</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1, position: 'relative' }}>
                {['Unlimited task submissions', 'Verified premium badge', 'Priority leaderboard ranking', 'AI Mentor full access', 'Business visibility boost', 'Certificate of completion'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(245,243,238,0.85)', alignItems: 'center' }}>
                    <span style={{ color: '#f0c040', fontSize: 16 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/checkout?plan=pro" className="btn-gold" style={{ textDecoration: 'none', textAlign: 'center', width: '100%', justifyContent: 'center', display: 'inline-block', padding: '13px 0', position: 'relative' }}>Upgrade to Pro →</Link>
            </div>

            {/* Business */}
            <div className="card-glass plan-card" style={{ padding: 36, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#00e5ff', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>Business</div>
                <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 44 }}>₹999<span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(245,243,238,0.4)' }}>/mo</span></div>
                <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 13, marginTop: 8 }}>Post tasks, review talent & hire verified students.</p>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                {['Post unlimited tasks', 'Access verified talent pool', 'Skill-score based filtering', 'Direct messaging with students', 'Analytics dashboard', 'Dedicated account manager'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(245,243,238,0.75)', alignItems: 'center' }}>
                    <span style={{ color: '#00e5ff', fontSize: 16 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=business" className="btn-ghost" style={{ textDecoration: 'none', textAlign: 'center', width: '100%', justifyContent: 'center', display: 'inline-block', padding: '13px 0', borderColor: 'rgba(0,229,255,0.4)', color: '#00e5ff' }}>Start Hiring</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign: 'center', padding: '80px 5%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 600, height: 600, transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(240,192,64,0.1), transparent 70%)', pointerEvents: 'none' }} />
        <h2 style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 56px)', marginBottom: 16, position: 'relative' }}>
          <span style={{ color: '#f5f3ee' }}>Ready to drop </span><span style={{ background: 'linear-gradient(90deg,#f0c040,#ff6ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>the resume?</span>
        </h2>
        <p style={{ color: 'rgba(245,243,238,0.5)', fontSize: 16, marginBottom: 36, position: 'relative' }}>Join 1,000+ students already building their verified skill portfolio.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
          <Link href="/signup" className="btn-gold" style={{ textDecoration: 'none', fontSize: 15, padding: '14px 36px' }}>Get Early Access →</Link>
          <Link href="/signup?role=business" className="btn-ghost" style={{ textDecoration: 'none', fontSize: 15, padding: '14px 36px' }}>Partner With Us</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '28px 5%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 18, background: 'linear-gradient(90deg,#f0c040,#ff6ef7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillDrop</div>
          <div style={{ color: 'rgba(245,243,238,0.5)', fontSize: 13 }}>Built for Bharat 🇮🇳</div>
          <div style={{ color: 'rgba(245,243,238,0.5)', fontSize: 12 }}>© 2025 SkillDrop</div>
        </div>
      </footer>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.12}}
        @keyframes float3d{0%,100%{transform:translateY(0px) rotate(0deg)}50%{transform:translateY(-18px) rotate(2deg)}}
        @keyframes pulse3d{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
        @keyframes floatBadge1{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes floatBadge2{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}
        @keyframes orbMove1{0%{transform:translate(0,0)}50%{transform:translate(60px,-40px)}100%{transform:translate(0,0)}}
        @keyframes orbMove2{0%{transform:translate(0,0)}50%{transform:translate(-50px,60px)}100%{transform:translate(0,0)}}
        @keyframes orbMove3{0%{transform:translate(0,0)}50%{transform:translate(40px,50px)}100%{transform:translate(0,0)}}
        @keyframes orbMove4{0%{transform:translate(0,0)}50%{transform:translate(-60px,-30px)}100%{transform:translate(0,0)}}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.18;}
        .orb1{width:500px;height:500px;background:radial-gradient(circle,#7c3aed,transparent);top:-100px;left:-100px;animation:orbMove1 14s ease-in-out infinite;}
        .orb2{width:400px;height:400px;background:radial-gradient(circle,#f0c040,transparent);top:20%;right:5%;animation:orbMove2 16s ease-in-out infinite;}
        .orb3{width:350px;height:350px;background:radial-gradient(circle,#00e5ff,transparent);bottom:20%;left:15%;animation:orbMove3 18s ease-in-out infinite;}
        .orb4{width:300px;height:300px;background:radial-gradient(circle,#ff6ef7,transparent);bottom:10%;right:20%;animation:orbMove4 12s ease-in-out infinite;}
        .hero-3d-wrapper{display:block;}
        @media(max-width:900px){.hero-3d-wrapper{display:none;}}
        .step-card{transition:0.3s;cursor:default;}
        .step-card:hover{transform:translateY(-4px);}
        .plan-card{transition:transform 0.3s;}
        .plan-card:hover{transform:translateY(-6px);}
      `}</style>
    </div>
  )
}
