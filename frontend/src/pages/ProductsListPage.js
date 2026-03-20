import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory, Link } from "react-router-dom"
import { CREATE_PRODUCT_RESET } from '../constants'
import { isFrontendOnlyMode, frontendOnlyMessage } from '../utils/appMode'
import { defaultSiteSettings } from '../utils/defaultSiteSettings'

const HERO_SLIDES = [
    {
        eyebrow: 'New Arrivals 🎧',
        title: 'Up to 40% Off on Electronics',
        sub: 'Smartphones, laptops, headphones — premium tech at Bangladeshi prices.',
        cta: 'Shop Electronics', link: '/?searchTerm=electronics',
        bg: 'linear-gradient(120deg,#0d0d0d 0%,#1a1a2e 100%)',
    },
    {
        eyebrow: 'Fresh Daily 🥦',
        title: 'Farm-Fresh Groceries Delivered',
        sub: 'Fresh vegetables, spices & daily essentials. Same-day Dhaka delivery.',
        cta: 'Shop Groceries', link: '/?searchTerm=grocery',
        bg: 'linear-gradient(120deg,#1b3a1b 0%,#2e7d32 100%)',
    },
    {
        eyebrow: 'Eid Special ✨',
        title: 'Festive Fashion Collection',
        sub: 'Sarees, Salwar Kameez, Punjabi — celebrate in style with Exclusive BD.',
        cta: 'Shop Fashion', link: '/?searchTerm=fashion',
        bg: 'linear-gradient(120deg,#2c1654 0%,#6a1a6a 100%)',
    },
    {
        eyebrow: 'Big Sale 🔥',
        title: 'Exclusive Weekend Offers',
        sub: 'Apply coupon EXCLUSIVE50 for ৳50 off your next order.',
        cta: 'View Offers', link: '/',
        bg: 'linear-gradient(120deg,#3d0c00 0%,#b03030 100%)',
    },
    {
        eyebrow: 'New In 🏠',
        title: 'Home & Living Essentials',
        sub: 'Cookware, décor, storage — everything for a beautiful Bangladeshi home.',
        cta: 'Shop Home', link: '/?searchTerm=home',
        bg: 'linear-gradient(120deg,#1a1200 0%,#c8922a 100%)',
    },
]

const SIDEBAR_CATEGORIES = [
    "Women's Fashion", "Men's Fashion", "Electronics", "Groceries",
    "Home & Living", "Medicine / Health", "Sports", "Baby & Kids",
]

function HeroCarousel() {
    const [active, setActive] = useState(0)

    const next = useCallback(() => setActive(a => (a + 1) % HERO_SLIDES.length), [])
    const prev = useCallback(() => setActive(a => (a - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [])

    useEffect(() => {
        const id = setInterval(next, 5000)
        return () => clearInterval(id)
    }, [next])

    return (
        <div className="hero-layout">
            {/* Sidebar */}
            <nav className="hero-sidebar">
                {SIDEBAR_CATEGORIES.map(cat => (
                    <Link
                        key={cat}
                        to={`/?searchTerm=${cat.split(' ')[0].toLowerCase()}`}
                        className="hero-sidebar-link"
                    >
                        {cat} <span>›</span>
                    </Link>
                ))}
            </nav>

            {/* Carousel */}
            <div className="hero-carousel">
                {HERO_SLIDES.map((slide, i) => (
                    <div key={i} className={`hero-slide${i === active ? ' active' : ''}`}
                        style={{ background: slide.bg }}>
                        <div className="hero-slide-content">
                            <div className="hero-slide-eyebrow">{slide.eyebrow}</div>
                            <h2 className="hero-slide-title">{slide.title}</h2>
                            <p className="hero-slide-sub">{slide.sub}</p>
                            <Link to={slide.link} className="hero-cta">{slide.cta} →</Link>
                        </div>
                    </div>
                ))}
                {/* Arrows */}
                <button className="hero-arrow hero-arrow-left" onClick={prev} aria-label="Previous slide">
                    <i className="fas fa-chevron-left" style={{ fontSize: '0.8rem' }}></i>
                </button>
                <button className="hero-arrow hero-arrow-right" onClick={next} aria-label="Next slide">
                    <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem' }}></i>
                </button>
                {/* Dots */}
                <div className="hero-dots">
                    {HERO_SLIDES.map((_, i) => (
                        <button key={i} className={`hero-dot${i === active ? ' active' : ''}`}
                            onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function FlashSaleCountdown() {
    const getEndOfDay = () => {
        const now = new Date()
        const end = new Date(now)
        end.setHours(23, 59, 59, 999)
        return end - now
    }

    const [timeLeft, setTimeLeft] = useState(getEndOfDay())

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getEndOfDay())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    const pad = (n) => String(n).padStart(2, '0')

    return (
        <div className="countdown-timer">
            <div className="countdown-block">{pad(hours)}</div>
            <span className="countdown-sep">:</span>
            <div className="countdown-block">{pad(minutes)}</div>
            <span className="countdown-sep">:</span>
            <div className="countdown-block">{pad(seconds)}</div>
        </div>
    )
}

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

    return (
        <div className="fade-in">
            <div className="container">
                {/* Hero Carousel — only on homepage */}
                {isHome && <HeroCarousel />}

                {/* Category Tiles */}
                {isHome && (
                    <div style={{ margin: '2.5rem 0' }}>
                        <div className="section-label">
                            <div className="section-red-bar" />
                            <h2 className="section-title">Browse By Category</h2>
                        </div>
                        <div className="category-grid">
                            {[
                                ['fa-mobile-alt', 'Phones', 'electronics'],
                                ['fa-laptop', 'Computers', 'electronics'],
                                ['fa-tshirt', 'Fashion', 'fashion'],
                                ['fa-apple-alt', 'Groceries', 'grocery'],
                                ['fa-home', 'Home & Living', 'home'],
                                ['fa-heartbeat', 'Health', 'health'],
                            ].map(([icon, label, term]) => (
                                <Link
                                    key={term}
                                    to={`/?searchTerm=${term}`}
                                    className="category-tile"
                                >
                                    <div className="category-tile-icon">
                                        <i className={`fas ${icon}`} />
                                    </div>
                                    <span className="category-tile-label">{label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Flash Sales Section */}
                {isHome && !loading && filteredProducts.length > 0 && (
                    <div style={{ margin: '2.5rem 0' }}>
                        <div className="section-label">
                            <div className="section-red-bar" />
                            <h2 className="section-title">Today's Flash Sales</h2>
                            <FlashSaleCountdown />
                        </div>
                        <Row>
                            {filteredProducts.slice(0, 4).map((product) => (
                                <Col key={product.id} sm={6} md={6} lg={3} className="mb-4 product-grid-item">
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    </div>
                )}

                {/* Trust Bar */}
                {isHome && (
                    <div className="trust-bar">
                        {[
                            ['fa-shipping-fast', 'FREE AND FAST DELIVERY', 'Free delivery on orders over ৳1,000'],
                            ['fa-headset', '24/7 CUSTOMER SERVICE', 'Friendly support around the clock'],
                            ['fa-shield-alt', 'MONEY BACK GUARANTEE', 'We return money within 30 days'],
                        ].map(([icon, title, text]) => (
                            <div key={title} className="trust-item">
                                <div className="trust-icon">
                                    <i className={`fas ${icon}`} />
                                </div>
                                <div>
                                    <strong className="trust-title">{title}</strong>
                                    <span className="trust-text">{text}</span>
                                </div>
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
                        {/* All Products Section */}
                        {isHome && (
                            <div style={{ margin: '2.5rem 0 1rem' }}>
                                <div className="section-label">
                                    <div className="section-red-bar" />
                                    <h2 className="section-title">Explore Our Products</h2>
                                    <span className="results-count">
                                        <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
                                    </span>
                                </div>
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
            </div>
        </div>
    )
}

export default ProductsListPage