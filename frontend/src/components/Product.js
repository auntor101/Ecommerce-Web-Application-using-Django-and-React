import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import React from 'react'

function Product({ product }) {
    return (
        <div className="fade-in">
            <Card 
                className="mb-4 product-card-hover h-100"
                style={{ 
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: 'none',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    position: 'relative'
                }}
            >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <Link to={`/product/${product.id}`}>
                        <Card.Img 
                            variant="top" 
                            src={product.image} 
                            height="200" 
                            style={{ 
                                borderRadius: '20px 20px 0 0',
                                objectFit: 'cover',
                                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                filter: 'brightness(1.05)'
                            }}
                            className="product-image"
                        />
                    </Link>
                    
                    {/* Stock Badge */}
                    {product.stock ? (
                        <div 
                            style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                boxShadow: '0 4px 12px rgba(17, 153, 142, 0.3)'
                            }}
                        >
                            <i className="fas fa-check-circle" style={{ marginRight: '4px' }}></i>
                            In Stock
                        </div>
                    ) : (
                        <div 
                            style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                boxShadow: '0 4px 12px rgba(255, 65, 108, 0.3)'
                            }}
                        >
                            <i className="fas fa-times-circle" style={{ marginRight: '4px' }}></i>
                            Out of Stock
                        </div>
                    )}

                    {/* Gradient Overlay on Hover */}
                    <div 
                        className="gradient-overlay"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none'
                        }}
                    />
                </div>

                <Card.Body 
                    style={{ 
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}
                >
                    <Link 
                        to={`/product/${product.id}`} 
                        style={{ 
                            textDecoration: 'none',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        <Card.Title 
                            as="div" 
                            style={{ 
                                marginBottom: '12px',
                                fontWeight: '700',
                                color: '#2d3748',
                                fontSize: '1.1rem',
                                lineHeight: '1.4',
                                minHeight: '2.8rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                transition: 'color 0.3s ease'
                            }}
                            className="product-title"
                        >
                            {product.name}
                        </Card.Title>
                    </Link>

                    {/* Rating Stars */}
                    <div style={{ marginBottom: '12px' }}>
                        {[...Array(5)].map((_, i) => (
                            <i 
                                key={i}
                                className="fas fa-star"
                                style={{
                                    color: i < 4 ? '#fbbf24' : '#d1d5db',
                                    fontSize: '0.9rem',
                                    marginRight: '2px'
                                }}
                            ></i>
                        ))}
                        <span style={{ 
                            marginLeft: '8px',
                            fontSize: '0.85rem',
                            color: '#6b7280',
                            fontWeight: '500'
                        }}>
                            (4.2)
                        </span>
                    </div>

                    <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto'
                    }}>
                        <Card.Text 
                            as="h3"
                            style={{
                                margin: 0,
                                color: '#667eea',
                                fontWeight: '800',
                                fontSize: '1.4rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            ৳ {product.price}
                        </Card.Text>

                        <Link to={`/product/${product.id}`}>
                            <button
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    padding: '8px 16px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                                }}
                                className="view-btn"
                            >
                                <i className="fas fa-eye" style={{ marginRight: '6px' }}></i>
                                View
                            </button>
                        </Link>
                    </div>
                </Card.Body>
            </Card>

            <style jsx>{`
                .product-card-hover:hover .product-image {
                    transform: scale(1.1);
                }
                
                .product-card-hover:hover .gradient-overlay {
                    opacity: 1;
                }
                
                .product-card-hover:hover .product-title {
                    color: #667eea;
                }
                
                .view-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
                }
            `}</style>
        </div>
    )
}

export default Product