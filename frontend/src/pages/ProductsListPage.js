import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory, Link } from "react-router-dom"
import { CREATE_PRODUCT_RESET } from '../constants'
import { isFrontendOnlyMode, frontendOnlyMessage } from '../utils/appMode'
import { defaultSiteSettings } from '../utils/defaultSiteSettings'

function ProductsListPage({ siteSettings = defaultSiteSettings }) {
    let history = useHistory()
    const params = new URLSearchParams(history.location.search)
    const searchTerm = params.get('searchTerm') || ''
    const dispatch = useDispatch()

    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loading, error, products } = productsListReducer

    useEffect(() => {
        dispatch(getProductsList())
        dispatch({ type: CREATE_PRODUCT_RESET })
    }, [dispatch])

    const filteredProducts = products.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const isHome = !searchTerm
    const heroStyle = siteSettings.hero_background_image
        ? {
            marginTop: '1.5rem',
            backgroundImage: `linear-gradient(rgba(27, 67, 50, 0.78), rgba(27, 67, 50, 0.78)), url(${siteSettings.hero_background_image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }
        : { marginTop: '1.5rem' }

    return (
        <div className="fade-in">
            <div className="container">
                {/* Hero Section — only on homepage */}
                {isHome && (
                    <div className="hero-section" style={heroStyle}>
                        <div className="hero-eyebrow">{siteSettings.hero_eyebrow}</div>
                        <h1 className="hero-title">
                            {siteSettings.hero_title}
                        </h1>
                        <p className="hero-subtitle">
                            {siteSettings.hero_subtitle}
                        </p>
                        <Link to="/" className="hero-cta">
                            <i className="fas fa-shopping-basket" />
                            Shop Now
                        </Link>
                    </div>
                )}

                {isHome && siteSettings.promo_background_image && (
                    <div
                        className="content-card"
                        style={{
                            marginBottom: '2rem',
                            border: 'none',
                            color: '#fff',
                            backgroundImage: `linear-gradient(rgba(45, 106, 79, 0.72), rgba(45, 106, 79, 0.72)), url(${siteSettings.promo_background_image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="section-eyebrow" style={{ color: 'rgba(255,255,255,0.75)' }}>Seasonal Banner</div>
                        <h2 className="section-title" style={{ color: '#fff' }}>{siteSettings.site_name}</h2>
                        <p style={{ margin: '0.75rem 0 0', maxWidth: '540px', color: 'rgba(255,255,255,0.88)' }}>
                            This banner image is controlled from the admin site settings page.
                        </p>
                    </div>
                )}

                {/* Trust Bar */}
                {isHome && (
                    <div className="trust-bar">
                        {[
                            ['fa-shipping-fast', 'Free delivery on orders over ৳1,000'],
                            ['fa-shield-alt', '100% Quality Guarantee'],
                            ['fa-hand-holding-heart', 'Locally Sourced Products'],
                            ['fa-headset', '24/7 Customer Support'],
                        ].map(([icon, text]) => (
                            <div key={text} className="trust-item">
                                <div className="trust-icon">
                                    <i className={`fas ${icon}`} />
                                </div>
                                <span className="trust-text">{text}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Search results header */}
                {!isHome && (
                    <div className="page-hero">
                        <div className="page-hero-eyebrow">Search Results</div>
                        <h1 className="page-hero-title">
                            Results for <strong>"{searchTerm}"</strong>
                        </h1>
                    </div>
                )}

                {isFrontendOnlyMode && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Message variant='info'>{frontendOnlyMessage}</Message>
                    </div>
                )}

                {error && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Message variant='danger'>{error}</Message>
                    </div>
                )}

                {loading && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '3rem 0' }}>
                        <Spinner animation="border" style={{ width: '1.4rem', height: '1.4rem' }} />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Loading products...
                        </span>
                    </div>
                )}

                {!loading && (
                    <>
                        {/* Section header for product grid */}
                        {isHome && (
                            <div className="section-header">
                                <h2 className="section-title">Our Products</h2>
                                <span className="results-count">
                                    <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
                                </span>
                            </div>
                        )}

                        {!isHome && (
                            <div className="results-bar">
                                <span className="results-count">
                                    <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
                                </span>
                            </div>
                        )}

                        {filteredProducts.length === 0 ? (
                            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                                    No products match your search.
                                </p>
                            </div>
                        ) : (
                            <Row>
                                {filteredProducts.map((product) => (
                                    <Col key={product.id} sm={6} md={6} lg={4} xl={3} className="mb-4 product-grid-item">
                                        <Product product={product} />
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </>
                )}

                {/* How It Works — only on homepage */}
                {isHome && !loading && (
                    <div className="how-it-works">
                        {[
                            ['fa-search', 'Browse', 'Explore fresh groceries, electronics, and everyday essentials.'],
                            ['fa-cart-plus', 'Add to Cart', 'Pick your favourites and add them to your bag with one click.'],
                            ['fa-truck', 'We Deliver', 'Fast, reliable delivery straight to your doorstep across Bangladesh.'],
                        ].map(([icon, title, desc]) => (
                            <div key={title} className="how-step">
                                <div className="how-step-icon">
                                    <i className={`fas ${icon}`} />
                                </div>
                                <div className="how-step-title">{title}</div>
                                <div className="how-step-desc">{desc}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductsListPage