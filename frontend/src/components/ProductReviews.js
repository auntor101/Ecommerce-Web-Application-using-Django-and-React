import React, { useState } from 'react'
import { Card, Button, Form, Modal } from 'react-bootstrap'

function ProductReviews({ productId, reviews = [] }) {
    const [showModal, setShowModal] = useState(false)
    const [newReview, setNewReview] = useState({ rating: 5, comment: '', name: '' })
    const [allReviews, setAllReviews] = useState(reviews)

    const handleSubmitReview = (e) => {
        e.preventDefault()
        const review = {
            id: Date.now(),
            ...newReview,
            date: new Date().toLocaleDateString(),
            verified: true
        }
        setAllReviews([review, ...allReviews])
        setNewReview({ rating: 5, comment: '', name: '' })
        setShowModal(false)
    }

    const averageRating = allReviews.length > 0 
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
        : 0

    const StarRating = ({ rating, size = '1rem', editable = false, onChange }) => (
        <div style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <i
                    key={star}
                    className={star <= rating ? 'fas fa-star' : 'far fa-star'}
                    onClick={editable ? () => onChange(star) : undefined}
                    style={{
                        color: '#fbbf24',
                        fontSize: size,
                        cursor: editable ? 'pointer' : 'default'
                    }}
                />
            ))}
        </div>
    )

    return (
        <>
            <Card style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                marginTop: '2rem'
            }}>
                <Card.Body style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h4 style={{ margin: 0, fontWeight: '700', color: '#2d3748' }}>
                                <i className="fas fa-star" style={{ marginRight: '10px', color: '#fbbf24' }}></i>
                                Reviews ({allReviews.length})
                            </h4>
                            {allReviews.length > 0 && (
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <StarRating rating={Math.round(averageRating)} />
                                    <span style={{ marginLeft: '8px', fontWeight: '600', color: '#667eea' }}>
                                        {averageRating.toFixed(1)} out of 5
                                    </span>
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={() => setShowModal(true)}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '10px 20px',
                                fontWeight: '600'
                            }}
                        >
                            <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                            Write Review
                        </Button>
                    </div>

                    {allReviews.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                            <i className="fas fa-comment-alt" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                            <h6>No reviews yet</h6>
                            <p>Be the first to review this product!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {allReviews.map(review => (
                                <div key={review.id} style={{
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                    border: '1px solid rgba(102, 126, 234, 0.1)',
                                    borderRadius: '12px',
                                    padding: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <div>
                                            <h6 style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>
                                                {review.name}
                                                {review.verified && (
                                                    <span style={{ 
                                                        marginLeft: '8px',
                                                        background: '#11998e',
                                                        color: 'white',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.7rem'
                                                    }}>
                                                        Verified
                                                    </span>
                                                )}
                                            </h6>
                                            <StarRating rating={review.rating} size="0.9rem" />
                                        </div>
                                        <small style={{ color: '#6b7280' }}>{review.date}</small>
                                    </div>
                                    <p style={{ margin: 0, color: '#4a5568', lineHeight: '1.5' }}>
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Review Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '20px 20px 0 0'
                }}>
                    <Modal.Title>Write a Review</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: '2rem' }}>
                    <Form onSubmit={handleSubmitReview}>
                        <Form.Group style={{ marginBottom: '1.5rem' }}>
                            <Form.Label style={{ fontWeight: '600', color: '#2d3748' }}>Your Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newReview.name}
                                onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                                required
                                style={{ borderRadius: '8px', border: '2px solid rgba(102, 126, 234, 0.2)' }}
                            />
                        </Form.Group>
                        
                        <Form.Group style={{ marginBottom: '1.5rem' }}>
                            <Form.Label style={{ fontWeight: '600', color: '#2d3748' }}>Rating</Form.Label>
                            <div style={{ marginTop: '0.5rem' }}>
                                <StarRating 
                                    rating={newReview.rating} 
                                    size="1.5rem"
                                    editable 
                                    onChange={(rating) => setNewReview({...newReview, rating})}
                                />
                            </div>
                        </Form.Group>
                        
                        <Form.Group style={{ marginBottom: '2rem' }}>
                            <Form.Label style={{ fontWeight: '600', color: '#2d3748' }}>Your Review</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                required
                                style={{ borderRadius: '8px', border: '2px solid rgba(102, 126, 234, 0.2)' }}
                            />
                        </Form.Group>
                        
                        <Button
                            type="submit"
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px'
                            }}
                        >
                            Submit Review
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ProductReviews