import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleCart } from '../actions/cartActions'

function CartIcon() {
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.cartReducer)
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <button
            onClick={() => dispatch(toggleCart())}
            style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                color: '#e2e8f0',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '8px',
                transition: 'all 0.3s ease'
            }}
            className="cart-icon-btn"
        >
            <i className="fas fa-shopping-cart"></i>
            {itemCount > 0 && (
                <span style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    background: '#ff416c',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    animation: itemCount > 0 ? 'bounce 0.3s ease' : 'none'
                }}>
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
            
            <style jsx>{`
                .cart-icon-btn:hover {
                    color: #667eea !important;
                    transform: scale(1.1);
                }
                
                @keyframes bounce {
                    0%, 20%, 60%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-10px);
                    }
                    80% {
                        transform: translateY(-5px);
                    }
                }
            `}</style>
        </button>
    )
}

export default CartIcon