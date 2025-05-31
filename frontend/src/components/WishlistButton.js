import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '../actions/wishlistActions'

function WishlistButton({ product, className = '' }) {
    const dispatch = useDispatch()
    const { items } = useSelector(state => state.wishlistReducer)
    const [isAnimating, setIsAnimating] = useState(false)
    
    const isInWishlist = items.some(item => item.id === product.id)

    const handleToggle = (e) => {
        e.stopPropagation()
        e.preventDefault()
        
        setIsAnimating(true)
        setTimeout(() => setIsAnimating(false), 300)
        
        if (isInWishlist) {
            dispatch(removeFromWishlist(product.id))
        } else {
            dispatch(addToWishlist(product))
        }
    }

    return (
        <button
            onClick={handleToggle}
            className={`wishlist-btn ${className}`}
            style={{
                background: isInWishlist ? '#ff416c' : 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
        >
            <i 
                className={isInWishlist ? 'fas fa-heart' : 'far fa-heart'}
                style={{
                    color: isInWishlist ? 'white' : '#ff416c',
                    fontSize: '1.1rem'
                }}
            ></i>
            
            <style jsx>{`
                .wishlist-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(255, 65, 108, 0.4);
                }
            `}</style>
        </button>
    )
}

export default WishlistButton