import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeFromWishlist } from '../actions/wishlistActions'
import { addToCart } from '../actions/cartActions'
import Product from '../components/Product'

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
            <div className="page-wrapper fade-in page-center-state">
                <div className="empty-page-state">
                    <i className="far fa-heart empty-page-icon" />
                    <h2>
                        Your wishlist is empty
                    </h2>
                    <p>
                        Save items you love and come back to them later.
                    </p>
                    <Link to="/" className="btn-atelier">
                        Discover Products
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page-wrapper fade-in wishlist-page">
            <div className="container page-pad-y">
                <div className="page-hero compact">
                    <div className="page-hero-eyebrow">Saved Picks</div>
                    <h1 className="page-hero-title">Wishlist ({wishlistItems.length})</h1>
                </div>

                <div className="wishlist-header-actions">
                    <h2 className="wishlist-subtitle">
                        Wishlist ({wishlistItems.length})
                    </h2>
                    <button
                        onClick={moveAllToBag}
                        className="btn-atelier-outline"
                    >
                        Move All to Bag
                    </button>
                </div>

                <div className="row g-3 mb-5">
                    {wishlistItems.map(item => {
                        const imgSrc = item.image || fallback(item.name, item.id)
                        return (
                            <div key={item.id} className="col-6 col-md-4 col-lg-3">
                                <div className="product-card product-card-wishlist">
                                    <button
                                        onClick={() => dispatch(removeFromWishlist(item.id))}
                                        title="Remove from wishlist"
                                        className="wishlist-remove-btn"
                                    >
                                        <i className="fas fa-times" />
                                    </button>

                                    <Link to={`/product/${item.id}/`} className="wishlist-card-link">
                                        <div className="product-card-image-wrap">
                                            <img
                                                src={imgSrc}
                                                alt={item.name}
                                                onError={e => { e.target.src = fallback(item.name, item.id) }}
                                                className="product-card-image"
                                            />
                                        </div>
                                    </Link>

                                    <button className="product-card-add-btn" onClick={() => dispatch(addToCart(item))}>
                                        <i className="fas fa-shopping-bag" />
                                        Add to Cart
                                    </button>

                                    <div className="product-card-body">
                                        <div className="product-card-title">{item.name}</div>
                                        <div className="product-card-footer">
                                            <div className="product-card-price">৳{Number(item.price).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {suggestions.length > 0 && (
                    <>
                        <div className="section-label wishlist-recommend-head">
                            <div className="section-red-bar" />
                            <h2 className="section-title">Just For You</h2>
                        </div>
                        <div className="row g-4">
                            {suggestions.map(product => (
                                <div key={product.id} className="col-6 col-md-4 col-lg-3 product-grid-item">
                                    <Product product={product} />
                                </div>
                            ))}
                        </div>
                        <div className="wishlist-see-all">
                            <Link to="/" className="wishlist-see-all-link">
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
