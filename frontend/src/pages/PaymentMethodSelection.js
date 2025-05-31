import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

function CardPaymentPage({ location, match }) {
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    })
    const [loading, setLoading] = useState(false)
    const history = useHistory()
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
            history.push('/payment-status', { 
                success: true, 
                amount: orderDetails?.amount || '0',
                method: paymentType 
            })
        }, 2000)
    }

    const getPaymentColor = () => paymentType === 'visa' ? '#1A1F71' : '#EB001B'

    return (
        <div className="fade-in" style={{ 
            minHeight: '100vh', 
            background: paymentType === 'visa' ? 
                'linear-gradient(135deg, #1A1F71, #4B5FDB)' : 
                'linear-gradient(135deg, #EB001B, #FF5F00)',
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
                            background: getPaymentColor(),
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            boxShadow: `0 10px 30px ${getPaymentColor()}40`
                        }}>
                            <i className="fas fa-credit-card" style={{ color: 'white', fontSize: '2rem' }}></i>
                        </div>
                        <h2 style={{ fontWeight: '700', color: '#2d3748', textTransform: 'capitalize' }}>
                            {paymentType} Payment
                        </h2>
                        <p style={{ color: '#6b7280' }}>Enter your card details securely</p>
                    </div>

                    <form onSubmit={handlePayment}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'block' }}>
                                <i className="fas fa-credit-card" style={{ marginRight: '8px', color: getPaymentColor() }}></i>
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
                                    border: `2px solid ${getPaymentColor()}`,
                                    borderRadius: '12px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'block' }}>
                                    <i className="fas fa-calendar" style={{ marginRight: '8px', color: getPaymentColor() }}></i>
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
                                        border: `2px solid ${getPaymentColor()}`,
                                        borderRadius: '12px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'block' }}>
                                    <i className="fas fa-lock" style={{ marginRight: '8px', color: getPaymentColor() }}></i>
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
                                        border: `2px solid ${getPaymentColor()}`,
                                        borderRadius: '12px',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'block' }}>
                                <i className="fas fa-user" style={{ marginRight: '8px', color: getPaymentColor() }}></i>
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
                                    border: `2px solid ${getPaymentColor()}`,
                                    borderRadius: '12px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{
                            background: `${getPaymentColor()}10`,
                            border: `1px solid ${getPaymentColor()}`,
                            borderRadius: '12px',
                            padding: '1rem',
                            marginBottom: '2rem'
                        }}>
                            <h6 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#2d3748' }}>
                                <i className="fas fa-receipt" style={{ marginRight: '8px', color: getPaymentColor() }}></i>
                                Payment Summary
                            </h6>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Amount:</span>
                                <span style={{ fontWeight: '700', color: getPaymentColor() }}>
                                    ৳{orderDetails?.amount || '0'}
                                </span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: loading ? '#ccc' : getPaymentColor(),
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

export default CardPaymentPage