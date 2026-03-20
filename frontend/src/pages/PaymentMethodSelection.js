import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function PaymentMethodSelection() {
    const location = useLocation()
    const orderDetails = location.state?.orderDetails || { amount: 0 }

    return (
        <div className="page-wrapper fade-in">
            <div className="container" style={{ paddingTop: '2.5rem' }}>
                <div className="section-label" style={{ marginBottom: '1rem' }}>
                    <div className="section-red-bar" />
                    <h1 className="section-title">Select Payment Method</h1>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Choose how you want to pay for this order.
                </p>

                <div className="content-card" style={{ maxWidth: 620 }}>
                    <Link
                        to={{
                            pathname: '/payment/bkash',
                            state: { orderDetails },
                        }}
                        className="payment-option"
                        style={{ textDecoration: 'none' }}
                    >
                        <i className="fas fa-mobile-alt" style={{ color: 'var(--primary)', width: 18 }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>bKash</span>
                    </Link>

                    <Link
                        to={{
                            pathname: '/payment/visa',
                            state: { orderDetails },
                        }}
                        className="payment-option"
                        style={{ textDecoration: 'none' }}
                    >
                        <i className="fas fa-credit-card" style={{ color: 'var(--primary)', width: 18 }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Visa</span>
                    </Link>

                    <Link
                        to={{
                            pathname: '/payment/mastercard',
                            state: { orderDetails },
                        }}
                        className="payment-option"
                        style={{ textDecoration: 'none' }}
                    >
                        <i className="fas fa-credit-card" style={{ color: 'var(--primary)', width: 18 }} />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>MasterCard</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PaymentMethodSelection
