import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createPortal } from 'react-dom'
import { toggleCart, removeFromCart, updateCartQuantity } from '../actions/cartActions'
import { Link } from 'react-router-dom'

function CartDrawer() {
    const dispatch = useDispatch()
    const { cartItems, isOpen } = useSelector(state => state.cartReducer)
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)

    if (!isOpen) return null

    const fallback = (name, id) => `https://picsum.photos/seed/${encodeURIComponent(name || id)}/80/80`

    return createPortal(
        <>
            <div className="cart-drawer-overlay" onClick={() => dispatch(toggleCart())} />
            <div className="cart-drawer">
                <div className="cart-drawer-header">
                    <h2 className="cart-drawer-title">
                        <i className="fas fa-shopping-bag" style={{ color: 'var(--gold)' }} />
                        Cart
                        {totalItems > 0 && (
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>
                                ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                            </span>
                        )}
                    </h2>
                    <button className="cart-drawer-close" onClick={() => dispatch(toggleCart())} aria-label="Close cart">
                        &times;
                    </button>
                </div>

                <div className="cart-drawer-body">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <i className="fas fa-shopping-bag" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--border-gold)' }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Your cart is empty</p>
                        </div>
                    ) : (
                        cartItems.map(item => {
                            const imgSrc = item.image || fallback(item.name, item.id)
                            return (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={imgSrc}
                                        onError={e => { e.target.src = fallback(item.name, item.id) }}
                                        alt={item.name}
                                        className="cart-item-img"
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="cart-item-name">{item.name}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                                            <button
                                                className="cart-qty-btn"
                                                onClick={() => dispatch(updateCartQuantity(item.id, item.quantity - 1))}
                                                disabled={item.quantity <= 1}
                                            >-</button>
                                            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: 18, textAlign: 'center' }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                className="cart-qty-btn"
                                                onClick={() => dispatch(updateCartQuantity(item.id, item.quantity + 1))}
                                            >+</button>
                                            <span style={{ marginLeft: 'auto', color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem' }}>
                                                &#2547;{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                        <button
                                            className="cart-item-remove"
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                        >
                                            <i className="fas fa-trash" style={{ marginRight: 4 }} /> Remove
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-drawer-footer">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</span>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)' }}>
                                &#2547;{total.toLocaleString()}
                            </span>
                        </div>
                        <Link to="/" onClick={() => dispatch(toggleCart())}>
                            <button className="btn-atelier" style={{ width: '100%' }}>
                                <i className="fas fa-credit-card" style={{ marginRight: 8 }} /> Proceed to Checkout
                            </button>
                        </Link>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.75rem', marginBottom: 0 }}>
                            Select a product on the listing to buy
                        </p>
                    </div>
                )}
            </div>
        </>,
        document.body
    )
}

export default CartDrawer