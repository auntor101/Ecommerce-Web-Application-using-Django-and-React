import React from 'react'

const stats = [
    { value: '10,500', label: 'Sellers Active', highlight: false },
    { value: '৳3.3M', label: 'Monthly Sales', highlight: true },
    { value: '45,500', label: 'Active Customers', highlight: false },
    { value: '25,000', label: 'Annual Gross', highlight: false },
]

const team = [
    { name: 'Rahim Hossain', role: 'Founder & CEO', initials: 'RH' },
    { name: 'Nusrat Jahan', role: 'Head of Operations', initials: 'NJ' },
    { name: 'Tariq Ahmed', role: 'Lead Developer', initials: 'TA' },
]

function AboutPage() {
    return (
        <div className="page-wrapper fade-in">
            {/* Hero */}
            <div style={{
                background: 'var(--black)',
                color: '#fff',
                padding: 'clamp(48px, 8vw, 96px) 0',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 60% 50%, rgba(219,68,68,.2) 0%, transparent 65%)',
                    pointerEvents: 'none'
                }} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="section-eyebrow" style={{ color: 'var(--primary)', marginBottom: '0.75rem' }}>Our Story</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, margin: '0 auto 1.5rem', maxWidth: 700 }}>
                        Bangladesh's Premier<br />E-Commerce Platform
                    </h1>
                    <p style={{ color: '#BBBBBB', maxWidth: 600, margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.75 }}>
                        Launched in Dhaka, serving 3 million customers across Bangladesh. We connect local sellers with shoppers nationwide — from fresh vegetables to the latest electronics.
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                {/* Story text */}
                <div className="row g-5 align-items-center mb-5">
                    <div className="col-lg-6">
                        <div className="section-eyebrow" style={{ marginBottom: '0.5rem' }}>Who We Are</div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 34px)', color: 'var(--black)', marginBottom: '1.25rem' }}>
                            Built for Bangladesh
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
                            Exclusive BD was founded in 2021 with a simple mission: make high-quality products accessible to every household in Bangladesh. We started with electronics and groceries and have grown to serve customers across all 8 divisions.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
                            We support local farmers and manufacturers by providing them a digital storefront, while offering shoppers the convenience of same-day delivery in Dhaka Metro and 2–7 day delivery across the country.
                        </p>
                    </div>
                    <div className="col-lg-6">
                        <div style={{
                            aspectRatio: '16/9',
                            background: 'var(--bg)',
                            borderRadius: 12,
                            border: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=700&auto=format&fit=crop"
                                alt="Bangladesh market"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="row g-3 mb-5">
                    {stats.map((s, i) => (
                        <div key={i} className="col-6 col-md-3">
                            <div className="content-card" style={{
                                textAlign: 'center', padding: '2rem 1rem',
                                background: s.highlight ? 'var(--primary)' : undefined,
                                color: s.highlight ? '#fff' : undefined
                            }}>
                                <div style={{
                                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                                    fontSize: 'clamp(24px, 4vw, 36px)',
                                    color: s.highlight ? '#fff' : 'var(--primary)',
                                    marginBottom: '0.4rem'
                                }}>{s.value}</div>
                                <div style={{ fontSize: '0.85rem', color: s.highlight ? 'rgba(255,255,255,.85)' : 'var(--text-secondary)' }}>
                                    {s.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Team */}
                <div className="section-label" style={{ marginBottom: '1.5rem' }}>
                    <div className="section-red-bar" />
                    <h2 className="section-title">Our Team</h2>
                </div>
                <div className="row g-4 justify-content-center mb-2">
                    {team.map((member, i) => (
                        <div key={i} className="col-sm-6 col-md-4">
                            <div className="content-card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                                <div style={{
                                    width: 80, height: 80, borderRadius: '50%',
                                    background: 'var(--primary)', color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700,
                                    margin: '0 auto 1rem'
                                }}>
                                    {member.initials}
                                </div>
                                <h4 style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>{member.name}</h4>
                                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.88rem' }}>{member.role}</p>
                                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.75rem' }}>
                                    {['fab fa-linkedin', 'fab fa-twitter'].map((icon, j) => (
                                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                        <a key={j} href="/" onClick={e => e.preventDefault()} style={{ color: 'var(--text-secondary)', transition: 'color .2s' }}
                                            onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                        >
                                            <i className={icon}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AboutPage
