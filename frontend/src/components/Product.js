import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../actions/cartActions'

function Product({ product }) {
    const dispatch = useDispatch()
    const fallbackImg = `https://picsum.photos/seed/${encodeURIComponent(product.name || product.id)}/600/450`
    const inStock = Number(product.stock || 0) > 0
    const hasDiscount = Number(product.discount_percent || 0) > 0

    const rating = product.rating || 0
    const stars = []
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) stars.push('full')
        else if (i - rating < 1) stars.push('half')
        else stars.push('empty')
    }

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (product.stock) {
            dispatch(addToCart(product, 1))
        }
    }

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-card-topline">
                {product.category_name && (
                    <div className="product-card-category">{product.category_name}</div>
                )}
                <span className={`product-card-stock ${inStock ? 'in-stock' : 'out-stock'}`}>
                    {inStock ? 'In stock' : 'Sold out'}
                </span>
            </div>
            <div className="product-card-image-wrap">
                <img
                    className="product-card-image"
                    src={product.image || fallbackImg}
                    alt={product.name}
                    loading="lazy"
                    onError={e => { e.target.src = fallbackImg }}
                />
                {hasDiscount && (
                    <span className="product-card-badge badge-discount">-{product.discount_percent}%</span>
                )}
                <button
                    className="product-wishlist-btn"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                    title="Add to Wishlist"
                >
                    <i className="far fa-heart" />
                </button>
                <button
                    className="product-card-add-btn"
                    onClick={handleAddToCart}
                    disabled={!inStock}
                >
                    <i className="fas fa-shopping-cart" /> {inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
            </div>
            <div className="product-card-body">
                <div className="product-card-title">{product.name}</div>
                <div className="product-card-stars">
                    {stars.map((type, i) => (
                        <i key={i} className={
                            type === 'full' ? 'fas fa-star' :
                            type === 'half' ? 'fas fa-star-half-alt' :
                            'far fa-star'
                        } />
                    ))}
                    {product.reviews_count !== undefined && (
                        <span className="product-card-reviews">({product.reviews_count})</span>
                    )}
                </div>
                <div className="product-card-footer">
                    <div className="product-card-price">
                        <span className="product-card-price-symbol">&#2547;</span>
                        {Number(product.price).toLocaleString()}
                        {product.old_price && (
                            <span className="product-card-price-old">
                                &#2547;{Number(product.old_price).toLocaleString()}
                            </span>
                        )}
                    </div>
                    <span className="product-card-cta">View details <i className="fas fa-arrow-right" /></span>
                </div>
            </div>
        </Link>
    )
}

export default Product
