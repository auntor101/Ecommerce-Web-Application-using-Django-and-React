import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function BkashPaymentPage({ location }) {
    const [phone, setPhone] = useState('')
    const [pin, setPin] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const orderDetails = location.state?.orderDetails

    const handlePayment = async (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            alert('Payment successful!')
            history.push('/payment-status', { 
                success: true, 
                amount: orderDetails?.amount || '0',
                method: 'bKash'
            })
        }, 2000)
    }

    return (
        <div className="page-wrapper fade-in">
            <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                <div className="content-card" style={{ maxWidth: 500, margin: '0 auto', padding: '2.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: 72,
                            height: 72,
                            background: '#E2136E',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem'
                        }}>
                            <i className="fas fa-mobile-alt" style={{ color: '#fff', fontSize: '1.8rem' }}></i>
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--black)', marginBottom: '0.25rem' }}>
                            bKash Payment
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                            Enter your bKash details to complete payment
                        </p>
                    </div>

                    <form onSubmit={handlePayment}>
                        <div className="form-group-custom" style={{ marginBottom: '1.25rem' }}>
                            <label className="form-label-custom">
                                <i className="fas fa-phone" style={{ marginRight: 8, color: '#E2136E' }}></i>
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+880-XXXXX-XXXXX"
                                required
                                className="form-input-custom"
                                style={{ borderColor: '#E2136E' }}
                            />
                        </div>

                        <div className="form-group-custom" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label-custom">
                                <i className="fas fa-lock" style={{ marginRight: 8, color: '#E2136E' }}></i>
                                PIN
                            </label>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="Enter your PIN"
                                required
                                className="form-input-custom"
                                style={{ borderColor: '#E2136E' }}
                            />
                        </div>

                        <div style={{
                            background: 'rgba(226,19,110,0.06)',
                            border: '1px solid rgba(226,19,110,0.25)',
                            borderRadius: 8,
                            padding: '1rem 1.25rem',
                            marginBottom: '1.75rem'
                        }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                                <i className="fas fa-receipt" style={{ marginRight: 6, color: '#E2136E' }}></i>
                                Payment Summary
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-primary)' }}>Amount</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#E2136E', fontSize: '1.2rem' }}>
                                    ৳{orderDetails?.amount || '0'}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: loading ? 'var(--text-secondary)' : '#E2136E',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '13px 0',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all .2s ease'
                            }}
                        >
                            {loading ? (
                                <><i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>Processing...</>
                            ) : (
                                <><i className="fas fa-mobile-alt" style={{ marginRight: 8 }}></i>Pay via bKash</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BkashPaymentPage