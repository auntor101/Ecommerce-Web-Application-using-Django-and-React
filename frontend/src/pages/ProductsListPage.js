import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory } from "react-router-dom";
import { CREATE_PRODUCT_RESET } from '../constants'

function ProductsListPage() {
    let history = useHistory()
    let searchTerm = history.location.search
    const dispatch = useDispatch()

    // products list reducer
    const productsListReducer = useSelector(state => state.productsListReducer)
    const { loading, error, products } = productsListReducer

    useEffect(() => {
        dispatch(getProductsList())
        dispatch({
            type: CREATE_PRODUCT_RESET
        })
    }, [dispatch])

    const filteredProducts = products.filter((item) =>
        item.name.toLowerCase().includes(searchTerm !== "" ? searchTerm.split("=")[1] : "")
    )

    const showNothingMessage = () => {
        return (
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '3rem',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                {!loading && (
                    <>
                        <i className="fas fa-search" style={{ 
                            fontSize: '4rem', 
                            color: '#667eea', 
                            marginBottom: '1rem',
                            opacity: 0.6
                        }}></i>
                        <Message variant='info'>
                            <strong>No products found</strong><br />
                            Try adjusting your search criteria
                        </Message>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="fade-in" style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            paddingBottom: '2rem'
        }}>
            {/* Hero Section */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '0 0 24px 24px',
                padding: '3rem 0',
                marginBottom: '2rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <div className="container text-center">
                    <h1 style={{
                        margin: 0,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontSize: '3rem',
                        fontWeight: '700',
                        marginBottom: '1rem'
                    }}>
                        <i className="fas fa-store" style={{ marginRight: '15px', color: '#667eea' }}></i>
                        Our Products
                    </h1>
                    <p style={{ 
                        color: '#6b7280', 
                        fontSize: '1.2rem', 
                        margin: 0,
                        maxWidth: '600px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        Discover amazing products at unbeatable prices. Quality guaranteed with fast delivery.
                    </p>
                    
                    {searchTerm && (
                        <div style={{ marginTop: '1rem' }}>
                            <span style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
                                Searching for: "{searchTerm.split("=")[1]}"
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="container">
                {/* Error Message */}
                {error && (
                    <div style={{ marginBottom: '2rem' }}>
                        <Message variant='danger'>{error}</Message>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div style={{ 
                        display: "flex", 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '4rem',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                        marginBottom: '2rem'
                    }}>
                        <Spinner 
                            animation="border" 
                            style={{ 
                                color: '#667eea',
                                width: '3rem',
                                height: '3rem',
                                marginRight: '1rem'
                            }}
                        />
                        <h5 style={{ margin: 0, fontWeight: '600', color: '#667eea' }}>
                            Loading Amazing Products...
                        </h5>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && (
                    <>
                        {/* Results Header */}
                        {filteredProducts.length > 0 && (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(15px)',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                marginBottom: '2rem',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ 
                                        margin: 0, 
                                        color: '#2d3748',
                                        fontWeight: '700'
                                    }}>
                                        <i className="fas fa-grid-3x3" style={{ marginRight: '10px', color: '#667eea' }}></i>
                                        {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
                                    </h4>
                                    <p style={{ margin: '0.5rem 0 0', color: '#6b7280' }}>
                                        Browse our curated collection
                                    </p>
                                </div>
                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    padding: '12px 20px',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <i className="fas fa-filter" style={{ marginRight: '8px' }}></i>
                                    All Categories
                                </div>
                            </div>
                        )}

                        {/* Products Grid */}
                        <div>
                            <Row>
                                {filteredProducts.length === 0 ? (
                                    <Col xs={12}>
                                        {showNothingMessage()}
                                    </Col>
                                ) : (
                                    filteredProducts.map((product, idx) => (
                                        <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
                                            <div className="slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                                                <Product product={product} />
                                            </div>
                                        </Col>
                                    ))
                                )}
                            </Row>
                        </div>

                        {/* Bottom CTA Section */}
                        {filteredProducts.length > 0 && (
                            <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '20px',
                                padding: '3rem',
                                textAlign: 'center',
                                color: 'white',
                                marginTop: '3rem',
                                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)'
                            }}>
                                <h3 style={{ margin: '0 0 1rem', fontWeight: '700' }}>
                                    <i className="fas fa-heart" style={{ marginRight: '10px' }}></i>
                                    Loving what you see?
                                </h3>
                                <p style={{ margin: '0 0 2rem', opacity: 0.9, fontSize: '1.1rem' }}>
                                    Join thousands of happy customers who trust us for quality products
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <div style={{ 
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        padding: '1rem 1.5rem',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <i className="fas fa-shipping-fast" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                                        <strong>Free Shipping</strong>
                                    </div>
                                    <div style={{ 
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        padding: '1rem 1.5rem',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <i className="fas fa-shield-alt" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                                        <strong>Secure Payment</strong>
                                    </div>
                                    <div style={{ 
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        padding: '1rem 1.5rem',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(10px)'
                                    }}>
                                        <i className="fas fa-undo" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                                        <strong>Easy Returns</strong>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ProductsListPage