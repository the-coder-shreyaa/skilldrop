'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Message {
  role: 'user' | 'mentor'
  text: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  'What skills should I build next?',
  'How do I improve my skill score?',
  'What tasks match my profile?',
  'How do I level up faster?',
  'What career path fits me?',
]

export default function MentorPage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (session?.user) {
      fetch('/api/me').then(r => r.json()).then(d => {
        setProfile(d)
        // Welcome message
        setMessages([{
          role: 'mentor',
          text: `Hey ${d.name}! 👋 I'm your AI Career Mentor.\n\nI can see you're a Level ${d.level} ${d.role === 'STUDENT' ? 'student' : 'professional'} with a Skill Score of ${d.skillScore}. You've earned ${d.xp} XP so far — great progress!\n\nAsk me anything about growing your career, improving your score, or which skills to focus on. I'm here to guide you! 🚀`,
          timestamp: new Date(),
        }])
      })
    }
  }, [session])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', text: text.trim(), timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), profile }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'mentor', text: data.reply, timestamp: new Date() }])
    } catch {
      setMessages(prev => [...prev, { role: 'mentor', text: "Sorry, I'm having trouble connecting right now. Try again in a moment.", timestamp: new Date() }])
    }
    setLoading(false)
  }

  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
      <p style={{ color: 'rgba(245,243,238,0.5)' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0 5%', backdropFilter: 'blur(20px)', background: 'rgba(10,10,15,0.85)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62, maxWidth: 1400, margin: '0 auto' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 800, fontSize: 20, textDecoration: 'none' }}>
            <span style={{ color: '#f5f3ee' }}>Skill</span><span style={{ color: '#f0c040' }}>Drop</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/dashboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Dashboard</Link>
            <Link href="/dashboard/tasks" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Tasks</Link>
            <Link href="/dashboard/wallet" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Wallet</Link>
            <Link href="/dashboard/badges" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Badges</Link>
            <Link href="/dashboard/mentor" style={{ color: '#f0c040', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8, background: 'rgba(240,192,64,0.08)' }}>Mentor</Link>
            <Link href="/dashboard/leaderboard" style={{ color: 'rgba(245,243,238,0.5)', textDecoration: 'none', fontSize: 13, padding: '7px 14px', borderRadius: 8 }}>Leaderboard</Link>
          </div>
        </div>
      </nav>

      <div style={{ padding: '80px 5% 0', maxWidth: 800, margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '24px 0 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(240,192,64,0.3)' }}>
            <Image src="/ai_mentor.png" alt="AI Mentor" width={52} height={52} style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-syne), Syne', fontWeight: 700, fontSize: 18 }}>SkillDrop AI Mentor</div>
            <div style={{ fontSize: 12, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
              Online · Powered by career intelligence
            </div>
          </div>
        </div>

        {/* Profile snapshot */}
        <div style={{ display: 'flex', gap: 12, padding: '16px 0', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <span className="pill" style={{ background: 'rgba(240,192,64,0.1)', color: '#f0c040', fontSize: 12 }}>Level {profile.level}</span>
          <span className="pill" style={{ background: 'rgba(0,229,255,0.1)', color: '#00e5ff', fontSize: 12 }}>Score: {profile.skillScore}</span>
          <span className="pill" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontSize: 12 }}>{profile.xp} XP</span>
          {profile.skills?.slice(0, 3).map((s: any) => (
            <span key={s.id} className="pill" style={{ fontSize: 12 }}>{s.name}</span>
          ))}
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 300, maxHeight: 'calc(100vh - 380px)' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              {msg.role === 'mentor' && (
                <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(240,192,64,0.2)' }}>
                    <Image src="/ai_mentor.png" alt="AI" width={36} height={36} style={{ objectFit: 'cover' }} />
                  </div>
              )}
              <div style={{
                maxWidth: '75%',
                background: msg.role === 'mentor' ? 'rgba(240,192,64,0.06)' : 'rgba(0,229,255,0.08)',
                border: `1px solid ${msg.role === 'mentor' ? 'rgba(240,192,64,0.15)' : 'rgba(0,229,255,0.15)'}`,
                borderRadius: msg.role === 'mentor' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                padding: '14px 18px',
              }}>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(245,243,238,0.85)', whiteSpace: 'pre-wrap', margin: 0 }}>{msg.text}</p>
                <div style={{ fontSize: 11, color: 'rgba(245,243,238,0.3)', marginTop: 8 }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(240,192,64,0.2)' }}>
              <Image src="/ai_mentor.png" alt="AI" width={36} height={36} style={{ objectFit: 'cover' }} />
            </div>
              <div style={{ background: 'rgba(240,192,64,0.06)', border: '1px solid rgba(240,192,64,0.15)', borderRadius: '4px 16px 16px 16px', padding: '14px 18px', display: 'flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#f0c040', animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`, opacity: 0.7 }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        <div style={{ padding: '12px 0', display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid var(--border)' }}>
          {QUICK_PROMPTS.map(p => (
            <button key={p} onClick={() => sendMessage(p)} style={{ background: 'rgba(240,192,64,0.06)', border: '1px solid rgba(240,192,64,0.15)', borderRadius: 20, padding: '7px 14px', fontSize: 12, color: 'rgba(245,243,238,0.6)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(240,192,64,0.12)'; (e.target as HTMLElement).style.color = '#f0c040' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = 'rgba(240,192,64,0.06)'; (e.target as HTMLElement).style.color = 'rgba(245,243,238,0.6)' }}>
              {p}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div style={{ padding: '16px 0 24px', display: 'flex', gap: 12 }}>
          <input
            className="input-dark"
            style={{ flex: 1 }}
            placeholder="Ask your career mentor anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
            disabled={loading}
          />
          <button
            className="btn-gold"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{ flexShrink: 0, padding: '0 20px' }}
          >
            Send →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
