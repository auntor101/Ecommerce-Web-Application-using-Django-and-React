import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Offcanvas, Button } from 'react-bootstrap'
import { toggleCart, removeFromCart, updateCartQuantity } from '../actions/cartActions'
import { Link } from 'react-router-dom'

function CartDrawer() {
    const dispatch = useDispatch()
    const { cartItems, isOpen } = useSelector(state => state.cartReducer)
    
    const getTotalPrice = () => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const getTotalItems = () => cartItems.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <Offcanvas 
            show={isOpen} 
            onHide={() => dispatch(toggleCart())} 
            placement="end"
            style={{ width: '400px' }}
        >
            <Offcanvas.Header 
                closeButton 
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}
            >
                <Offcanvas.Title style={{ fontWeight: '700' }}>
                    <i className="fas fa-shopping-cart" style={{ marginRight: '10px' }}></i>
                    Shopping Cart ({getTotalItems()})
                </Offcanvas.Title>
            </Offcanvas.Header>
            
            <Offcanvas.Body style={{ padding: 0 }}>
                {cartItems.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 2rem',
                        color: '#6b7280'
                    }}>
                        <i className="fas fa-shopping-cart" style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                        <h5>Your cart is empty</h5>
                        <p>Add some products to get started!</p>
                    </div>
                ) : (
                    <>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                            {cartItems.map(item => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    padding: '1rem',
                                    borderBottom: '1px solid #e2e8f0',
                                    gap: '1rem'
                                }}>
                                    <img 
                                        src={item.image} 
                                        alt={item.name}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <h6 style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                            {item.name}
                                        </h6>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => dispatch(updateCartQuantity(item.id, item.quantity - 1))}
                                                    disabled={item.quantity <= 1}
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        border: '1px solid #667eea',
                                                        background: 'white',
                                                        borderRadius: '4px',
                                                        color: '#667eea',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => dispatch(updateCartQuantity(item.id, item.quantity + 1))}
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        border: '1px solid #667eea',
                                                        background: 'white',
                                                        borderRadius: '4px',
                                                        color: '#667eea',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span style={{ fontWeight: '700', color: '#667eea' }}>
                                                ৳{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ff416c',
                                                fontSize: '0.8rem',
                                                marginTop: '0.5rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <i className="fas fa-trash" style={{ marginRight: '4px' }}></i>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div style={{
                            padding: '1.5rem',
                            borderTop: '1px solid #e2e8f0',
                            background: '#f8fafc'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '1rem',
                                fontSize: '1.2rem',
                                fontWeight: '700'
                            }}>
                                <span>Total:</span>
                                <span style={{ color: '#667eea' }}>৳{getTotalPrice().toLocaleString()}</span>
                            </div>
                            <Link to="/checkout" onClick={() => dispatch(toggleCart())}>
                                <Button style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '12px',
                                    fontWeight: '600'
                                }}>
                                    <i className="fas fa-credit-card" style={{ marginRight: '8px' }}></i>
                                    Proceed to Checkout
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    )
}

export default CartDrawer