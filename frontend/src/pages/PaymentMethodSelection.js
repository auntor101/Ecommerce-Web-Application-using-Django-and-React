import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function PaymentMethodSelection() {
    const location = useLocation()
    const orderDetails = location.state?.orderDetails || { amount: 0 }

    return (
        <div className="page-wrapper fade-in checkout-page">
            <div className="container page-pad-y">
                <div className="page-hero compact checkout-page-hero">
                    <div className="page-hero-eyebrow">Checkout</div>
                    <h1 className="page-hero-title">Select Payment Method</h1>
                </div>

                <p className="checkout-help-text">
                    Choose how you want to pay for this order.
                </p>

                <div className="content-card checkout-method-card">
                    <Link
                        to={{
                            pathname: '/payment/bkash',
                            state: { orderDetails },
                        }}
                        className="payment-option"
                    >
                        <i className="fas fa-mobile-alt checkout-payment-icon" />
                        <span className="checkout-payment-name">bKash</span>
                    </Link>

                    <Link
                        to={{
                            pathname: '/payment/visa',
                            state: { orderDetails },
                        }}
                        className="payment-option"
                    >
                        <i className="fas fa-credit-card checkout-payment-icon" />
                        <span className="checkout-payment-name">Visa</span>
                    </Link>

                    <Link
                        to={{
                            pathname: '/payment/mastercard',
                            state: { orderDetails },
                        }}
                        className="payment-option"
                    >
                        <i className="fas fa-credit-card checkout-payment-icon" />
                        <span className="checkout-payment-name">MasterCard</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PaymentMethodSelection
