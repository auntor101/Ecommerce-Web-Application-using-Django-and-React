import React from 'react'
import { Link } from 'react-router-dom'

function Product({ product }) {
    const fallbackImg = `https://picsum.photos/seed/${encodeURIComponent(product.name || product.id)}/600/450`

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-card-image-wrap">
                <img
                    className="product-card-image"
                    src={product.image || fallbackImg}
                    alt={product.name}
                    loading="lazy"
                    onError={e => { e.target.src = fallbackImg }}
                />
                <span className={`product-card-badge ${product.stock ? 'badge-in-stock' : 'badge-out-stock'}`}>
                    {product.stock ? 'In Stock' : 'Sold Out'}
                </span>
            </div>
            <div className="product-card-body">
                {product.category_name && (
                    <div className="product-card-category">{product.category_name}</div>
                )}
                <div className="product-card-title">{product.name}</div>
                <div className="product-card-footer">
                    <div className="product-card-price">
                        <span className="product-card-price-symbol">$</span>
                        {Number(product.price).toFixed(2)}
                    </div>
                    <span className="product-card-cta">View <span>â†’</span></span>
                </div>
            </div>
        </Link>
    )
}

export default Product


