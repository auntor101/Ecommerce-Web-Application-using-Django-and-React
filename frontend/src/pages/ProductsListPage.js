import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory } from "react-router-dom"
import { CREATE_PRODUCT_RESET } from '../constants'
import { isFrontendOnlyMode, frontendOnlyMessage } from '../utils/appMode'

function ProductsListPage() {
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

    return (
        <div className="fade-in">
            <div className="container">
                {/* Editorial hero */}
                <div className="page-hero">
                    <div className="page-hero-eyebrow">
                        {searchTerm ? 'Search Results' : 'Our Collection'}
                    </div>
                    <h1 className="page-hero-title">
                        {searchTerm ? (
                            <>Results for <strong>"{searchTerm}"</strong></>
                        ) : (
                            <><strong>Curated</strong> Selection</>
                        )}
                    </h1>
                    {!searchTerm && (
                        <p className="page-hero-subtitle">
                            Fresh groceries, household essentials, personal care and electronics — delivered across Bangladesh.
                        </p>
                    )}
                </div>

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
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
                            Loading collection...
                        </span>
                    </div>
                )}

                {!loading && (
                    <>
                        <div className="results-bar">
                            <span className="results-count">
                                <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', letterSpacing: '0.05em' }}>
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