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
            <div className="page-wrapper fade-in" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <i className="fas fa-shopping-cart" style={{ fontSize: '4rem', color: 'var(--border)', marginBottom: '1.5rem', display: 'block' }}></i>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--black)', marginBottom: '0.5rem' }}>
                        Your cart is empty
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Add some products to get started.
                    </p>
                    <Link to="/" className="btn-primary-red" style={{ textDecoration: 'none' }}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page-wrapper fade-in">
            <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 32px)', color: 'var(--black)', marginBottom: '2rem' }}>
                    Shopping Cart
                </h1>

                {/* Cart Table */}
                <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--black)', color: '#fff' }}>
                                {['Product', 'Price', 'Quantity', 'Subtotal', ''].map((h, i) => (
                                    <th key={i} style={{
                                        padding: '14px 16px', textAlign: i === 4 ? 'center' : 'left',
                                        fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem',
                                        borderRadius: i === 0 ? '6px 0 0 0' : i === 4 ? '0 6px 0 0' : 0
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    {/* Product */}
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <img
                                                src={item.image || fallback(item.name, item.id)}
                                                alt={item.name}
                                                onError={e => { e.target.src = fallback(item.name, item.id) }}
                                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }}
                                            />
                                            <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{item.name}</span>
                                        </div>
                                    </td>
                                    {/* Price */}
                                    <td style={{ padding: '16px', fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>
                                        ৳{Number(item.price).toLocaleString()}
                                    </td>
                                    {/* Quantity */}
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 6, width: 'fit-content', overflow: 'hidden' }}>
                                            <button
                                                onClick={() => dispatch(updateCartQuantity(item.id, Math.max(1, item.quantity - 1)))}
                                                style={{ width: 34, height: 38, background: 'var(--bg)', border: 'none', cursor: 'pointer', fontSize: '1rem', borderRight: '1px solid var(--border)' }}
                                            >–</button>
                                            <span style={{ minWidth: 40, textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, padding: '0 4px' }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => dispatch(updateCartQuantity(item.id, item.quantity + 1))}
                                                style={{ width: 34, height: 38, background: 'var(--bg)', border: 'none', cursor: 'pointer', fontSize: '1rem', borderLeft: '1px solid var(--border)' }}
                                            >+</button>
                                        </div>
                                    </td>
                                    {/* Subtotal */}
                                    <td style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                                        ৳{(item.price * item.quantity).toLocaleString()}
                                    </td>
                                    {/* Remove */}
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <button
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                            title="Remove item"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '1rem', transition: 'color .2s' }}
                                            onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Action row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button style={{ height: 42, padding: '0 1.5rem', background: 'transparent', border: '1.5px solid var(--black)', borderRadius: 6, fontWeight: 500, cursor: 'pointer', transition: 'all .2s' }}>
                            ← Return to Shop
                        </button>
                    </Link>
                </div>

                {/* Bottom row: coupon + totals */}
                <div className="row g-4">
                    {/* Coupon */}
                    <div className="col-md-5">
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <input
                                value={coupon}
                                onChange={e => setCoupon(e.target.value)}
                                placeholder="Coupon code"
                                className="form-input-custom"
                                style={{ flex: 1, borderRadius: 6 }}
                                disabled={couponApplied}
                            />
                            <button
                                onClick={applyCoupon}
                                disabled={couponApplied}
                                className="btn-primary-red"
                                style={{ whiteSpace: 'nowrap', opacity: couponApplied ? 0.6 : 1 }}
                            >
                                {couponApplied ? '✓ Applied' : 'Apply Coupon'}
                            </button>
                        </div>
                    </div>

                    {/* Cart Total */}
                    <div className="col-md-7 col-lg-5 ms-auto">
                        <div className="content-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '1.25rem' }}>Cart Total</h3>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.92rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>৳{subtotal.toLocaleString()}</span>
                            </div>

                            {discount > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.92rem' }}>
                                    <span style={{ color: 'var(--green)' }}>Discount</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', fontWeight: 600 }}>–৳{discount}</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.92rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                                <span style={{ fontFamily: 'var(--font-mono)', color: shipping === 0 ? 'var(--green)' : 'var(--text-primary)', fontWeight: 600 }}>
                                    {shipping === 0 ? 'Free' : `৳${shipping}`}
                                </span>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600 }}>Total</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', fontSize: '1.25rem' }}>
                                        ৳{total.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => history.push('/payment-method')}
                                className="btn-primary-red"
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
