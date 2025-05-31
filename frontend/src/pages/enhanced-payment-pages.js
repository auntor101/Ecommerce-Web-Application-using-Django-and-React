// PaymentMethodSelection.js
import React, { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const paymentMethods = [
    {
        id: 'bkash',
        name: 'bKash',
        icon: 'mobile-alt',
        color: '#E2136E',
        description: 'Pay with your bKash mobile wallet'
    },
    {
        id: 'visa',
        name: 'Visa',
        icon: 'credit-card',
        color: '#1A1F71',
        description: 'Pay securely with Visa card'
    },
    {
        id: 'mastercard',
        name: 'MasterCard',
        icon: 'credit-card',
        color: '#EB001B',
        description: 'Pay securely with MasterCard'
    }
]

function PaymentMethodSelection({ orderDetails }) {
    const [selected, setSelected] = useState('')
    const history = useHistory()

    const handleProceed = () => {
        if (selected) {
            history.push(`/payment/${selected}`, { orderDetails })
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem 0' }}>
            <div className="container">
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '3rem',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontWeight: '700', color: '#2d3748' }}>
                        <i className="fas fa-credit-card" style={{ marginRight: '10px', color: '#667eea' }}></i>
                        Choose Payment Method
                    </h2>

                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                        {paymentMethods.map(method => (
                            <Card
                                key={method.id}
                                onClick={() => setSelected(method.id)}
                                style={{
                                    border: selected === method.id ? `3px solid ${method.color}` : '2px solid #e2e8f0',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    background: selected === method.id ? `${method.color}10` : 'white'
                                }}
                                className="payment-method-card"
                            >
                                <Card.Body style={{ padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: method.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: '1rem'
                                    }}>
                                        <i className={`fas fa-${method.icon}`} style={{ color: 'white', fontSize: '1.5rem' }}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h5 style={{ margin: 0, fontWeight: '700', color: '#2d3748' }}>{method.name}</h5>
                                        <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
                                            {method.description}
                                        </p>
                                    </div>
                                    {selected === method.id && (
                                        <i className="fas fa-check-circle" style={{ color: method.color, fontSize: '1.5rem' }}></i>
                                    )}
                                </Card.Body>
                            </Card>
                        ))}
                    </div>

                    <Button
                        onClick={handleProceed}
                        disabled={!selected}
                        style={{
                            width: '100%',
                            background: selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '16px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: selected ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Proceed to Payment
                    </Button>
                </div>
            </div>
        </div>
    )
}

// BkashPaymentPage.js
function BkashPaymentPage({ location }) {
    const [phone, setPhone] = useState('')
    const [pin, setPin] = useState('')
    const [loading, setLoading] = useState(false)
    const orderDetails = location.state?.orderDetails

    const handlePayment = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Simulate payment processing
        setTimeout(() => {
            setLoading(false)
            alert('Payment successful!')
        }, 2000)
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #E2136E, #FF6B9D)', padding: '2rem 0' }}>
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
                            margin: '0 auto 1rem'
                        }}>
                            <i className="fas fa-mobile-alt" style={{ color: 'white', fontSize: '2rem' }}></i>
                        </div>
                        <h2 style={{ fontWeight: '700', color: '#2d3748' }}>bKash Payment</h2>
                        <p style={{ color: '#6b7280' }}>Enter your bKash details to complete payment</p>
                    </div>

                    <form onSubmit={handlePayment}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'block' }}>
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
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'block' }}>
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
                                    fontSize: '1rem'
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
                            <h6 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Payment Summary</h6>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Amount:</span>
                                <span style={{ fontWeight: '700', color: '#E2136E' }}>৳{orderDetails?.amount || '0'}</span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: '#E2136E',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '16px',
                                fontSize: '1.1rem',
                                fontWeight: '600'
                            }}
                        >
                            {loading ? 'Processing...' : 'Pay Now'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

// CardPaymentPage.js (Visa/MasterCard)
function CardPaymentPage({ location, match }) {
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    })
    const [loading, setLoading] = useState(false)
    const paymentType = match.params.type // visa or mastercard
    const orderDetails = location.state?.orderDetails

    const handleInputChange = (field, value) => {
        setCardData(prev => ({ ...prev, [field]: value }))
    }

    const handlePayment = async (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            alert('Payment successful!')
        }, 2000)
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: paymentType === 'visa' ? 'linear-gradient(135deg, #1A1F71, #4B5FDB)' : 'linear-gradient(135deg, #EB001B, #FF5F00)',
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
                        <h2 style={{ fontWeight: '700', color: '#2d3748', textTransform: 'capitalize' }}>
                            {paymentType} Payment
                        </h2>
                        <p style={{ color: '#6b7280' }}>Enter your card details securely</p>
                    </div>

                    <form onSubmit={handlePayment}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'block' }}>
                                Card Number
                            </label>
                            <input
                                type="text"
                                value={cardData.number}
                                onChange={(e) => handleInputChange('number', e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '2px solid #667eea',
                                    borderRadius: '12px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'block' }}>
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    value={cardData.expiry}
                                    onChange={(e) => handleInputChange('expiry', e.target.value)}
                                    placeholder="MM/YY"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: '2px solid #667eea',
                                        borderRadius: '12px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'block' }}>
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    value={cardData.cvv}
                                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                                    placeholder="123"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '14px 16px',
                                        border: '2px solid #667eea',
                                        borderRadius: '12px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'block' }}>
                                Cardholder Name
                            </label>
                            <input
                                type="text"
                                value={cardData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="John Doe"
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '2px solid #667eea',
                                    borderRadius: '12px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: paymentType === 'visa' ? '#1A1F71' : '#EB001B',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '16px',
                                fontSize: '1.1rem',
                                fontWeight: '600'
                            }}
                        >
                            {loading ? 'Processing...' : `Pay ৳${orderDetails?.amount || '0'}`}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export { PaymentMethodSelection, BkashPaymentPage, CardPaymentPage }