import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function CardPaymentPage({ location, match }) {
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' })
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const paymentType = match.params.type // visa or mastercard
    const orderDetails = location.state?.orderDetails
    const brandColor = paymentType === 'visa' ? '#1A1F71' : '#EB001B'
    const brandLabel = paymentType === 'mastercard' ? 'MasterCard' : 'VISA'

    const handleInputChange = (field, value) => setCardData(prev => ({ ...prev, [field]: value }))

    const handlePayment = async (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            alert('Payment successful!')
            history.push('/payment-status', { success: true, amount: orderDetails?.amount || '0', method: paymentType })
        }, 2000)
    }

    return (
        <div className="page-wrapper fade-in">
            <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
                <div className="content-card" style={{ maxWidth: 520, margin: '0 auto', padding: '2.5rem' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: 72, height: 72, background: brandColor,
                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 1rem'
                        }}>
                            <i className="fas fa-credit-card" style={{ color: '#fff', fontSize: '1.8rem' }}></i>
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--black)', marginBottom: '0.25rem' }}>
                            {brandLabel} Payment
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Enter your card details securely</p>
                    </div>

                    <form onSubmit={handlePayment}>
                        {/* Card Number */}
                        <div className="form-group-custom" style={{ marginBottom: '1.25rem' }}>
                            <label className="form-label-custom">
                                <i className="fas fa-credit-card" style={{ marginRight: 8, color: brandColor }}></i>
                                Card Number
                            </label>
                            <input
                                type="text"
                                value={cardData.number}
                                onChange={(e) => handleInputChange('number', e.target.value)}
                                placeholder="XXXX XXXX XXXX XXXX"
                                required
                                className="form-input-custom"
                                style={{ borderColor: brandColor }}
                            />
                        </div>

                        {/* Expiry + CVV */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div className="form-group-custom">
                                <label className="form-label-custom">
                                    <i className="fas fa-calendar" style={{ marginRight: 8, color: brandColor }}></i>
                                    Expiry
                                </label>
                                <input
                                    type="text"
                                    value={cardData.expiry}
                                    onChange={(e) => handleInputChange('expiry', e.target.value)}
                                    placeholder="MM/YY"
                                    required
                                    className="form-input-custom"
                                    style={{ borderColor: brandColor }}
                                />
                            </div>
                            <div className="form-group-custom">
                                <label className="form-label-custom">
                                    <i className="fas fa-lock" style={{ marginRight: 8, color: brandColor }}></i>
                                    CVV
                                </label>
                                <input
                                    type="text"
                                    value={cardData.cvv}
                                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                                    placeholder="123"
                                    required
                                    className="form-input-custom"
                                    style={{ borderColor: brandColor }}
                                />
                            </div>
                        </div>

                        {/* Cardholder Name */}
                        <div className="form-group-custom" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label-custom">
                                <i className="fas fa-user" style={{ marginRight: 8, color: brandColor }}></i>
                                Cardholder Name
                            </label>
                            <input
                                type="text"
                                value={cardData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Name on card"
                                required
                                className="form-input-custom"
                            />
                        </div>

                        {/* Summary */}
                        <div style={{
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            padding: '1rem 1.25rem',
                            marginBottom: '1.75rem'
                        }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                                <i className="fas fa-receipt" style={{ marginRight: 6, color: 'var(--primary)' }}></i>
                                Payment Summary
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-primary)' }}>Amount</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '1.2rem' }}>
                                    ৳{orderDetails?.amount || '0'}
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary-red"
                            style={{ width: '100%', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? (
                                <><i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>Processing...</>
                            ) : (
                                <><i className="fas fa-lock" style={{ marginRight: 8 }}></i>Pay ৳{orderDetails?.amount || '0'}</>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CardPaymentPage