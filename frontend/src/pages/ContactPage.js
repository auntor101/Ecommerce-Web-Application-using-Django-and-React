import React, { useState } from 'react'

function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
    const [sent, setSent] = useState(false)

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = (e) => {
        e.preventDefault()
        setSent(true)
    }

    return (
        <div className="page-wrapper fade-in">
            <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
                {/* Page heading */}
                <div className="section-label" style={{ marginBottom: '0.5rem' }}>
                    <div className="section-red-bar" />
                    <span className="section-eyebrow">Get In Touch</span>
                </div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 42px)', color: 'var(--black)', marginBottom: '0.5rem' }}>
                    Contact Us
                </h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: 600 }}>
                    We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>

                <div className="row g-4">
                    {/* Left — Info cards */}
                    <div className="col-lg-4">
                        {/* Call Us */}
                        <div className="content-card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{
                                width: 44, height: 44, background: 'var(--primary)', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <i className="fas fa-phone" style={{ color: '#fff', fontSize: '1rem' }}></i>
                            </div>
                            <div>
                                <h5 style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.95rem' }}>Call Us</h5>
                                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.88rem', lineHeight: 1.7 }}>
                                    +880-1XXX-XXXXXX<br />
                                    Available 24/7, 7 days a week<br />
                                    bKash Support: 16247
                                </p>
                            </div>
                        </div>

                        {/* Write to Us */}
                        <div className="content-card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{
                                width: 44, height: 44, background: 'var(--primary)', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <i className="fas fa-envelope" style={{ color: '#fff', fontSize: '1rem' }}></i>
                            </div>
                            <div>
                                <h5 style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.95rem' }}>Write to Us</h5>
                                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.88rem', lineHeight: 1.7 }}>
                                    customer@exclusivebd.com<br />
                                    support@exclusivebd.com<br />
                                    We reply within 24 hours.
                                </p>
                            </div>
                        </div>

                        {/* Office */}
                        <div className="content-card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{
                                width: 44, height: 44, background: 'var(--primary)', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <i className="fas fa-map-marker-alt" style={{ color: '#fff', fontSize: '1rem' }}></i>
                            </div>
                            <div>
                                <h5 style={{ fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.95rem' }}>Our Office</h5>
                                <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.88rem', lineHeight: 1.7 }}>
                                    Gulshan-1, Dhaka<br />
                                    Bangladesh — 1212<br />
                                    Sat–Thu: 9AM – 10PM
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Contact form */}
                    <div className="col-lg-8">
                        <div className="content-card" style={{ padding: '2rem' }}>
                            {sent ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{
                                        width: 64, height: 64, background: 'var(--green)', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                                    }}>
                                        <i className="fas fa-check" style={{ color: '#fff', fontSize: '1.6rem' }}></i>
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--black)', marginBottom: '0.5rem' }}>
                                        Message Sent!
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>
                                        Thank you for reaching out. We'll get back to you within 24 hours.
                                    </p>
                                    <button className="btn-primary-red" onClick={() => setSent(false)} style={{ marginTop: '1rem' }}>
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3" style={{ marginBottom: '1rem' }}>
                                        <div className="col-md-6">
                                            <div className="form-group-custom">
                                                <label className="form-label-custom">Your Name</label>
                                                <input
                                                    name="name"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Full name"
                                                    required
                                                    className="form-input-custom"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group-custom">
                                                <label className="form-label-custom">Email Address</label>
                                                <input
                                                    name="email"
                                                    type="email"
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    placeholder="you@example.com"
                                                    required
                                                    className="form-input-custom"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group-custom" style={{ marginBottom: '1rem' }}>
                                        <label className="form-label-custom">Phone Number</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleChange}
                                            placeholder="+880-XXXXX-XXXXX"
                                            className="form-input-custom"
                                        />
                                    </div>

                                    <div className="form-group-custom" style={{ marginBottom: '1.5rem' }}>
                                        <label className="form-label-custom">Your Message</label>
                                        <textarea
                                            name="message"
                                            value={form.message}
                                            onChange={handleChange}
                                            placeholder="How can we help you?"
                                            required
                                            rows={5}
                                            className="form-input-custom"
                                            style={{ resize: 'vertical', minHeight: 120 }}
                                        />
                                    </div>

                                    <button type="submit" className="btn-primary-red">
                                        <i className="fas fa-paper-plane" style={{ marginRight: 8 }}></i>
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* WhatsApp floating button */}
            <a
                href="https://wa.me/8801000000000"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    position: 'fixed',
                    bottom: '1.5rem',
                    right: '1.5rem',
                    width: 52,
                    height: 52,
                    background: '#25D366',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(37,211,102,0.4)',
                    zIndex: 999,
                    transition: 'transform .2s ease'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                title="Chat on WhatsApp"
            >
                <i className="fab fa-whatsapp" style={{ color: '#fff', fontSize: '1.5rem' }}></i>
            </a>
        </div>
    )
}

export default ContactPage
