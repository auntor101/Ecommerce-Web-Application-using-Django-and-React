import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
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
        // Simulate payment processing
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
        <div className="fade-in" style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #E2136E, #FF6B9D)', 
            padding: '2rem 0' 
        }}>
            <div className="container">
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '3rem',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: '#E2136E',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            boxShadow: '0 10px 30px rgba(226, 19, 110, 0.4)'
                        }}>
                            <i className="fas fa-mobile-alt" style={{ color: 'white', fontSize: '2rem' }}></i>
                        </div>
                        <h2 style={{ fontWeight: '700', color: '#2d3748' }}>bKash Payment</h2>
                        <p style={{ color: '#6b7280' }}>Enter your bKash details to complete payment</p>
                    </div>

                    <form onSubmit={handlePayment}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ 
                                fontWeight: '600', 
                                color: '#2d3748', 
                                marginBottom: '0.5rem', 
                                display: 'block' 
                            }}>
                                <i className="fas fa-phone" style={{ marginRight: '8px', color: '#E2136E' }}></i>
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="01XXXXXXXXX"
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '2px solid #E2136E',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ 
                                fontWeight: '600', 
                                color: '#2d3748', 
                                marginBottom: '0.5rem', 
                                display: 'block' 
                            }}>
                                <i className="fas fa-lock" style={{ marginRight: '8px', color: '#E2136E' }}></i>
                                PIN
                            </label>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value)}
                                placeholder="Enter your PIN"
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '2px solid #E2136E',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>

                        <div style={{
                            background: '#FFF0F6',
                            border: '1px solid #E2136E',
                            borderRadius: '12px',
                            padding: '1rem',
                            marginBottom: '2rem'
                        }}>
                            <h6 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2d3748' }}>
                                <i className="fas fa-receipt" style={{ marginRight: '8px', color: '#E2136E' }}></i>
                                Payment Summary
                            </h6>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Amount:</span>
                                <span style={{ fontWeight: '700', color: '#E2136E' }}>
                                    ৳{orderDetails?.amount || '0'}
                                </span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: loading ? '#ccc' : '#E2136E',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '16px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-credit-card" style={{ marginRight: '8px' }}></i>
                                    Pay ৳{orderDetails?.amount || '0'}
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BkashPaymentPage