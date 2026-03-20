import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeFromWishlist } from '../actions/wishlistActions'
import { addToCart } from '../actions/cartActions'

function WishlistPage() {
    const dispatch = useDispatch()
    const { items: wishlistItems } = useSelector(state => state.wishlistReducer)
    const { products } = useSelector(state => state.getProductsReducer)

    const fallback = (name, id) =>
        `https://picsum.photos/seed/${encodeURIComponent(name || id)}/300/300`

    const moveAllToBag = () => {
        wishlistItems.forEach(item => dispatch(addToCart(item)))
    }

    // "Just For You" — pick products not already wishlisted
    const wishedIds = new Set(wishlistItems.map(i => i.id))
    const suggestions = (products || []).filter(p => !wishedIds.has(p.id)).slice(0, 4)

    if (wishlistItems.length === 0) {
        return (
            <div className="page-wrapper fade-in" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <i className="far fa-heart" style={{ fontSize: '4rem', color: 'var(--border)', marginBottom: '1.5rem', display: 'block' }}></i>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--black)', marginBottom: '0.5rem' }}>
                        Your wishlist is empty
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Save items you love and come back to them later.
                    </p>
                    <Link to="/" className="btn-primary-red" style={{ textDecoration: 'none' }}>
                        Discover Products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page-wrapper fade-in">
            <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 30px)', color: 'var(--black)', margin: 0 }}>
                        Wishlist ({wishlistItems.length})
                    </h1>
                    <button
                        onClick={moveAllToBag}
                        style={{
                            height: 40, padding: '0 1.5rem', background: 'transparent',
                            border: '1.5px solid var(--black)', borderRadius: 6,
                            fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem',
                            transition: 'all .2s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = 'var(--black)'; e.currentTarget.style.color = '#fff' }}
                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'inherit' }}
                    >
                        Move All to Bag
                    </button>
                </div>

                {/* Wishlist Grid */}
                <div className="row g-3 mb-5">
                    {wishlistItems.map(item => {
                        const imgSrc = item.image || fallback(item.name, item.id)
                        return (
                            <div key={item.id} className="col-6 col-md-4 col-lg-3">
                                <div className="product-card" style={{ position: 'relative' }}>
                                    {/* Remove button */}
                                    <button
                                        onClick={() => dispatch(removeFromWishlist(item.id))}
                                        title="Remove from wishlist"
                                        style={{
                                            position: 'absolute', top: 8, right: 8, zIndex: 2,
                                            width: 32, height: 32, borderRadius: '50%',
                                            background: '#fff', border: '1px solid var(--border)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', transition: 'all .2s', boxShadow: '0 2px 6px rgba(0,0,0,.08)'
                                        }}
                                        onMouseOver={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.querySelector('i').style.color = '#fff' }}
                                        onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.querySelector('i').style.color = 'var(--text-secondary)' }}
                                    >
                                        <i className="fas fa-times" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}></i>
                                    </button>

                                    {/* Image */}
                                    <Link to={`/product/${item.id}/`} style={{ textDecoration: 'none' }}>
                                        <div className="product-card-img-wrap">
                                            <img
                                                src={imgSrc}
                                                alt={item.name}
                                                onError={e => { e.target.src = fallback(item.name, item.id) }}
                                                className="product-card-img"
                                            />
                                        </div>
                                    </Link>

                                    {/* Add to Cart hover overlay */}
                                    <div className="product-card-add-btn" onClick={() => dispatch(addToCart(item))}>
                                        <i className="fas fa-shopping-bag" style={{ marginRight: 6 }}></i>
                                        Add to Cart
                                    </div>

                                    {/* Info */}
                                    <div className="product-card-body">
                                        <div className="product-card-name">{item.name}</div>
                                        <div className="product-card-price">
                                            ৳{Number(item.price).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Just For You */}
                {suggestions.length > 0 && (
                    <>
                        <div className="section-label" style={{ marginBottom: '1.25rem' }}>
                            <div className="section-red-bar" />
                            <h2 className="section-title">Just For You</h2>
                        </div>
                        <div className="row g-3">
                            {suggestions.map(product => (
                                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                                    <Link to={`/product/${product.id}/`} style={{ textDecoration: 'none' }}>
                                        <div className="product-card">
                                            <div className="product-card-img-wrap">
                                                <img
                                                    src={product.image || fallback(product.name, product.id)}
                                                    alt={product.name}
                                                    onError={e => { e.target.src = fallback(product.name, product.id) }}
                                                    className="product-card-img"
                                                />
                                            </div>
                                            <div className="product-card-body">
                                                <div className="product-card-name">{product.name}</div>
                                                <div className="product-card-price">
                                                    ৳{Number(product.price).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                            <Link to="/" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                                See All Products →
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default WishlistPage
