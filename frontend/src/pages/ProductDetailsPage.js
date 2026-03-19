import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, getProductDetails } from '../actions/productActions'
import { addToCart } from '../actions/cartActions'
import Message from '../components/Message'
import { Spinner, Row, Col, Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CREATE_PRODUCT_RESET, DELETE_PRODUCT_RESET, UPDATE_PRODUCT_RESET } from '../constants'
import { isFrontendOnlyMode } from '../utils/appMode'

function ProductDetailsPage({ history, match }) {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading, error, product } = productDetailsReducer

    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const deleteProductReducer = useSelector(state => state.deleteProductReducer)
    const { success: productDeletionSuccess } = deleteProductReducer

    useEffect(() => {
        dispatch(getProductDetails(match.params.id))
        dispatch({ type: UPDATE_PRODUCT_RESET })
        dispatch({ type: CREATE_PRODUCT_RESET })
    }, [dispatch, match])

    const confirmDelete = () => {
        dispatch(deleteProduct(match.params.id))
        handleClose()
    }

    if (productDeletionSuccess) {
        alert("Product successfully deleted.")
        history.push("/")
        dispatch({ type: DELETE_PRODUCT_RESET })
    }

    const fallbackImg = product
        ? `https://picsum.photos/seed/${encodeURIComponent(product.name || product.id)}/600/450`
        : 'https://picsum.photos/seed/product/600/450'

    return (
        <div className="page-wrapper fade-in">
            {/* Delete Modal */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{product?.name}"</strong>? This cannot be undone.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            <div className="container" style={{ paddingTop: '2.5rem' }}>
                {loading && (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Spinner animation="border" style={{ color: 'var(--gold)' }} />
                    </div>
                )}
                {error && <Message variant='danger'>{error}</Message>}

                {!loading && !error && product && (
                    <Row>
                        {/* Image */}
                        <Col md={5} className="mb-4">
                            <img
                                src={product.image || fallbackImg}
                                onError={e => { e.target.src = fallbackImg }}
                                alt={product.name}
                                className="product-detail-img"
                            />
                            {userInfo && userInfo.admin && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                                    <Button variant="danger" onClick={handleShow}>
                                        <i className="fas fa-trash me-2" />Delete
                                    </Button>
                                    <Button variant="secondary" onClick={() => history.push(`/product-update/${product.id}/`)}>
                                        <i className="fas fa-edit me-2" />Edit
                                    </Button>
                                </div>
                            )}
                        </Col>

                        {/* Details */}
                        <Col md={7}>
                            <div className="content-card">
                                {product.category_name && (
                                    <div className="section-eyebrow">{product.category_name}</div>
                                )}
                                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                    {product.name}
                                </h1>

                                <span className={`product-badge ${product.stock ? 'product-badge-stock' : 'product-badge-no-stock'}`}>
                                    {product.stock ? 'In Stock' : 'Out of Stock'}
                                </span>

                                <div className="product-detail-price">
                                    ${Number(product.price).toFixed(2)}
                                </div>

                                {product.description && (
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
                                        {product.description}
                                    </p>
                                )}

                                {/* CTA */}
                                {!isFrontendOnlyMode && userInfo && product.stock ? (
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                        <button
                                            onClick={() => dispatch(addToCart(product))}
                                            className="btn-atelier"
                                            style={{ flex: 1 }}
                                        >
                                            <i className="fas fa-cart-plus me-2" />Add to Cart
                                        </button>
                                        <Link to={`/checkout/${product.id}/`} style={{ flex: 1 }}>
                                            <button className="btn-atelier-outline" style={{ width: '100%' }}>
                                                <i className="fas fa-credit-card me-2" />Buy Now
                                            </button>
                                        </Link>
                                    </div>
                                ) : !product.stock ? (
                                    <Message variant="danger">Out of Stock</Message>
                                ) : isFrontendOnlyMode ? (
                                    <Message variant="info">Sign in to purchase</Message>
                                ) : (
                                    <Link to="/login">
                                        <Button variant="primary" style={{ width: '100%' }}>Sign In to Purchase</Button>
                                    </Link>
                                )}

                                {/* Perks */}
                                <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                                    {[['fa-shipping-fast', 'Free Delivery'], ['fa-shield-alt', 'Warranty'], ['fa-undo', 'Easy Returns']].map(([icon, label]) => (
                                        <div key={label} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            <i className={`fas ${icon}`} style={{ color: 'var(--gold)', fontSize: '1.2rem', display: 'block', marginBottom: '0.35rem' }} />
                                            <small style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>{label}</small>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    )
}

export default ProductDetailsPage
