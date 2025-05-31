import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, getProductDetails } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner, Row, Col, Container, Card, Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { CREATE_PRODUCT_RESET, DELETE_PRODUCT_RESET, UPDATE_PRODUCT_RESET, CARD_CREATE_RESET } from '../constants'

function ProductDetailsPage({ history, match }) {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // product details reducer
    const productDetailsReducer = useSelector(state => state.productDetailsReducer)
    const { loading, error, product } = productDetailsReducer

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // product delete reducer
    const deleteProductReducer = useSelector(state => state.deleteProductReducer)
    const { success: productDeletionSuccess } = deleteProductReducer

    useEffect(() => {
        dispatch(getProductDetails(match.params.id))
        dispatch({ type: UPDATE_PRODUCT_RESET })
        dispatch({ type: CREATE_PRODUCT_RESET })
        dispatch({ type: CARD_CREATE_RESET })
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

    return (
        <div className="fade-in" style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            paddingBottom: '2rem'
        }}>
            {/* Delete Confirmation Modal */}
            <Modal show={show} onHide={handleClose}>
                <div style={{
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(20px)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    overflow: 'hidden'
                }}>
                    <Modal.Header closeButton style={{
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                        color: 'white'
                    }}>
                        <Modal.Title style={{ fontWeight: '700' }}>
                            <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
                            Delete Confirmation
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem' }}>
                        <p style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748' }}>
                            Are you sure you want to delete <strong>"{product.name}"</strong>?
                        </p>
                        <p style={{ margin: '1rem 0 0', color: '#6b7280' }}>
                            This action cannot be undone.
                        </p>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
                        <Button 
                            variant="danger" 
                            onClick={confirmDelete}
                            style={{
                                background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                fontWeight: '600'
                            }}
                        >
                            <i className="fas fa-trash" style={{ marginRight: '8px' }}></i>
                            Confirm Delete
                        </Button>
                        <Button 
                            variant="secondary" 
                            onClick={handleClose}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                fontWeight: '600'
                            }}
                        >
                            Cancel
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

            <div className="container" style={{ paddingTop: '2rem' }}>
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
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
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
                            Loading Product Details...
                        </h5>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div style={{ marginBottom: '2rem' }}>
                        <Message variant='danger'>{error}</Message>
                    </div>
                )}

                {/* Product Details */}
                {!loading && !error && product && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        padding: '2rem',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <Container>
                            <Row>
                                {/* Product Image */}
                                <Col md={6} className="mb-4">
                                    <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden' }}>
                                        <Card.Img 
                                            variant="top" 
                                            src={product.image} 
                                            style={{ 
                                                height: '450px',
                                                objectFit: 'cover',
                                                filter: 'brightness(1.05)'
                                            }}
                                        />
                                        
                                        {/* Stock Badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '20px',
                                            left: '20px',
                                            background: product.stock ? 
                                                'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 
                                                'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                                            color: 'white',
                                            padding: '12px 20px',
                                            borderRadius: '16px',
                                            fontSize: '1rem',
                                            fontWeight: '700',
                                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                                        }}>
                                            <i className={`fas fa-${product.stock ? 'check' : 'times'}-circle`} style={{ marginRight: '8px' }}></i>
                                            {product.stock ? 'In Stock' : 'Out of Stock'}
                                        </div>

                                        {/* Rating Badge */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '20px',
                                            right: '20px',
                                            background: 'rgba(0, 0, 0, 0.7)',
                                            color: 'white',
                                            padding: '8px 12px',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(10px)'
                                        }}>
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className="fas fa-star" style={{ color: i < 4 ? '#fbbf24' : '#6b7280', fontSize: '0.9rem' }}></i>
                                            ))}
                                            <span style={{ marginLeft: '8px', fontWeight: '600' }}>4.2</span>
                                        </div>
                                    </div>

                                    {/* Admin Actions */}
                                    {userInfo && userInfo.admin && (
                                        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <button
                                                onClick={handleShow}
                                                style={{
                                                    background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    padding: '16px',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 8px 25px rgba(255, 65, 108, 0.3)'
                                                }}
                                                className="admin-btn"
                                            >
                                                <i className="fas fa-trash" style={{ marginRight: '8px' }}></i>
                                                Delete Product
                                            </button>

                                            <button
                                                onClick={() => history.push(`/product-update/${product.id}/`)}
                                                style={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    padding: '16px',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                                                }}
                                                className="admin-btn"
                                            >
                                                <i className="fas fa-edit" style={{ marginRight: '8px' }}></i>
                                                Edit Product
                                            </button>
                                        </div>
                                    )}
                                </Col>

                                {/* Product Info */}
                                <Col md={6}>
                                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        {/* Product Name */}
                                        <h1 style={{
                                            fontSize: '2.5rem',
                                            fontWeight: '700',
                                            color: '#2d3748',
                                            marginBottom: '1rem',
                                            lineHeight: '1.2'
                                        }}>
                                            {product.name}
                                        </h1>

                                        {/* Price */}
                                        <div style={{ marginBottom: '2rem' }}>
                                            <span style={{
                                                fontSize: '3rem',
                                                fontWeight: '800',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text'
                                            }}>
                                                ৳{product.price}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <div style={{ 
                                            flex: 1,
                                            marginBottom: '2rem',
                                            padding: '2rem',
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(102, 126, 234, 0.1)'
                                        }}>
                                            <h4 style={{ 
                                                color: '#2d3748',
                                                fontWeight: '700',
                                                marginBottom: '1rem',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <i className="fas fa-info-circle" style={{ marginRight: '10px', color: '#667eea' }}></i>
                                                Product Description
                                            </h4>
                                            <p style={{ 
                                                fontSize: '1.1rem',
                                                lineHeight: '1.6',
                                                color: '#4a5568',
                                                margin: 0,
                                                whiteSpace: 'pre-line'
                                            }}>
                                                {product.description}
                                            </p>
                                        </div>

                                        {/* Purchase Section */}
                                        <div style={{
                                            padding: '2rem',
                                            background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.05) 0%, rgba(56, 239, 125, 0.05) 100%)',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(17, 153, 142, 0.1)'
                                        }}>
                                            <h4 style={{ 
                                                color: '#2d3748',
                                                fontWeight: '700',
                                                marginBottom: '1.5rem',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <i className="fas fa-shopping-cart" style={{ marginRight: '10px', color: '#11998e' }}></i>
                                                Ready to Purchase?
                                            </h4>
                                            
                                            {product.stock ? (
                                                <Link to={`${product.id}/checkout/`} style={{ textDecoration: 'none' }}>
                                                    <button style={{
                                                        width: '100%',
                                                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                                        border: 'none',
                                                        borderRadius: '16px',
                                                        color: 'white',
                                                        padding: '20px',
                                                        fontSize: '1.2rem',
                                                        fontWeight: '700',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: '0 8px 25px rgba(17, 153, 142, 0.4)'
                                                    }} className="purchase-btn">
                                                        <i className="fas fa-credit-card" style={{ marginRight: '12px', fontSize: '1.3rem' }}></i>
                                                        Proceed to Payment
                                                    </button>
                                                </Link>
                                            ) : (
                                                <div style={{
                                                    background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                                                    borderRadius: '16px',
                                                    padding: '20px',
                                                    textAlign: 'center'
                                                }}>
                                                    <Message variant='danger' style={{ margin: 0, background: 'transparent', border: 'none', color: 'white' }}>
                                                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
                                                        <strong>Out Of Stock!</strong>
                                                    </Message>
                                                </div>
                                            )}

                                            {/* Features */}
                                            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                                                <div style={{ textAlign: 'center', color: '#11998e' }}>
                                                    <i className="fas fa-shipping-fast" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                                                    <small style={{ fontWeight: '600' }}>Free Shipping</small>
                                                </div>
                                                <div style={{ textAlign: 'center', color: '#11998e' }}>
                                                    <i className="fas fa-shield-alt" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                                                    <small style={{ fontWeight: '600' }}>Warranty</small>
                                                </div>
                                                <div style={{ textAlign: 'center', color: '#11998e' }}>
                                                    <i className="fas fa-undo" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                                                    <small style={{ fontWeight: '600' }}>Easy Returns</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                )}
            </div>

            <style jsx>{`
                .admin-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25) !important;
                }
                
                .purchase-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(17, 153, 142, 0.6) !important;
                }
            `}</style>
        </div>
    )
}

export default ProductDetailsPage