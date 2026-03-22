import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { removeFromCart, updateCartQuantity } from '../actions/cartActions'

function CartPage() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { cartItems } = useSelector(state => state.cartReducer)
    const [coupon, setCoupon] = useState('')
    const [discount, setDiscount] = useState(0)
    const [couponApplied, setCouponApplied] = useState(false)

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const shipping = subtotal >= 500 ? 0 : 60
    const total = subtotal + shipping - discount

    const applyCoupon = () => {
        if (coupon.toUpperCase() === 'EXCLUSIVE50') {
            setDiscount(50)
            setCouponApplied(true)
        } else {
            alert('Invalid coupon code')
        }
    }

    const fallback = (name, id) =>
        `https://picsum.photos/seed/${encodeURIComponent(name || id)}/80/80`

    if (cartItems.length === 0) {
        return (
            <div className="page-wrapper fade-in page-center-state">
                <div className="empty-page-state">
                    <i className="fas fa-shopping-cart empty-page-icon" />
                    <h2>
                        Your cart is empty
                    </h2>
                    <p>
                        Add some products to get started.
                    </p>
                    <Link to="/" className="btn-atelier">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page-wrapper fade-in cart-page">
            <div className="container page-pad-y">
                <div className="page-hero compact">
                    <div className="page-hero-eyebrow">Bag</div>
                    <h1 className="page-hero-title">Shopping Cart</h1>
                </div>

                <div className="cart-table-wrap">
                    <table className="cart-table">
                        <thead>
                            <tr>
                                {['Product', 'Price', 'Quantity', 'Subtotal', ''].map((h, i) => (
                                    <th key={i} className={i === 4 ? 'text-center' : ''}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="cart-product-cell">
                                            <img
                                                src={item.image || fallback(item.name, item.id)}
                                                alt={item.name}
                                                onError={e => { e.target.src = fallback(item.name, item.id) }}
                                                className="cart-product-thumb"
                                            />
                                            <span className="cart-product-name">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="cart-price-cell">
                                        ৳{Number(item.price).toLocaleString()}
                                    </td>
                                    <td>
                                        <div className="cart-qty-control">
                                            <button
                                                onClick={() => dispatch(updateCartQuantity(item.id, Math.max(1, item.quantity - 1)))}
                                                className="cart-qty-control-btn"
                                            >–</button>
                                            <span className="cart-qty-control-value">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => dispatch(updateCartQuantity(item.id, item.quantity + 1))}
                                                className="cart-qty-control-btn"
                                            >+</button>
                                        </div>
                                    </td>
                                    <td className="cart-subtotal-cell">
                                        ৳{(item.price * item.quantity).toLocaleString()}
                                    </td>
                                    <td className="text-center">
                                        <button
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                            title="Remove item"
                                            className="cart-remove-btn"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="cart-action-row">
                    <Link to="/">
                        <button className="btn-atelier-outline">
                            <i className="fas fa-arrow-left" /> Return to Shop
                        </button>
                    </Link>
                </div>

                <div className="row g-4">
                    <div className="col-md-5">
                        <div className="cart-coupon-row">
                            <input
                                value={coupon}
                                onChange={e => setCoupon(e.target.value)}
                                placeholder="Coupon code"
                                className="form-input-custom"
                                style={{ flex: 1 }}
                                disabled={couponApplied}
                            />
                            <button
                                onClick={applyCoupon}
                                disabled={couponApplied}
                                className="btn-atelier"
                                style={{ whiteSpace: 'nowrap', opacity: couponApplied ? 0.6 : 1 }}
                            >
                                {couponApplied ? '✓ Applied' : 'Apply Coupon'}
                            </button>
                        </div>
                    </div>

                    <div className="col-md-7 col-lg-5 ms-auto">
                        <div className="content-card cart-total-card">
                            <h3>Cart Total</h3>

                            <div className="cart-total-row">
                                <span>Subtotal</span>
                                <span className="mono">৳{subtotal.toLocaleString()}</span>
                            </div>

                            {discount > 0 && (
                                <div className="cart-total-row is-discount">
                                    <span>Discount</span>
                                    <span className="mono">–৳{discount}</span>
                                </div>
                            )}

                            <div className="cart-total-row">
                                <span>Shipping</span>
                                <span className={`mono ${shipping === 0 ? 'is-free' : ''}`}>
                                    {shipping === 0 ? 'Free' : `৳${shipping}`}
                                </span>
                            </div>

                            <div className="cart-total-final">
                                <div className="cart-total-row">
                                    <span>Total</span>
                                    <span className="cart-final-amount">
                                        ৳{total.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => history.push('/payment-method')}
                                className="btn-atelier"
                                style={{ width: '100%' }}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage
