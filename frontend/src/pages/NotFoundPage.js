import React from 'react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
    return (
        <div className="page-wrapper fade-in" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(64px, 12vw, 120px)',
                    fontWeight: 900,
                    color: 'var(--primary)',
                    lineHeight: 1,
                    marginBottom: '0.5rem',
                    letterSpacing: '-2px'
                }}>
                    404
                </div>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(20px, 3vw, 32px)',
                    color: 'var(--black)',
                    marginBottom: '1rem'
                }}>
                    Page Not Found
                </h2>
                <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    marginBottom: '2.5rem',
                    maxWidth: 400,
                    margin: '0 auto 2.5rem'
                }}>
                    Oops! The page you visited could not be found. It may have been moved or deleted.
                </p>
                <Link to="/" className="btn-primary-red" style={{ textDecoration: 'none', display: 'inline-block' }}>
                    Back to Home Page
                </Link>
            </div>
        </div>
    )
}

export default NotFoundPage
