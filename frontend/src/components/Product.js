import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import React from 'react'

function Product({ product }) {
    return (
        <div>
            <Card className="mb-4 rounded shadow product-card-hover" style={{ transition: 'transform 0.2s, box-shadow 0.2s', border: 'none' }}>
                <Card.Body>
                    <Link to={`/product/${product.id}`}>
                        <Card.Img variant="top" src={product.image} height="162" style={{ borderRadius: '12px', objectFit: 'cover', boxShadow: '0 2px 12px rgba(0,158,60,0.08)' }} />
                    </Link>
                    <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
                        <Card.Title as="div" style={{ marginTop: '10px', fontWeight: 'bold', color: '#222' }}>
                            {product.name}
                        </Card.Title>
                    </Link>
                    <Card.Text as="h3" style={{ color: '#009e3c', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '8px' }}>
                        ৳ {product.price}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Product
