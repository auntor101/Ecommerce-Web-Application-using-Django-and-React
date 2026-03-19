import React from 'react'
import { Row, Col } from 'react-bootstrap'

export const ProductCardSkeleton = () => (
    <div style={{
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.07)',
        background: '#161512',
        overflow: 'hidden'
    }}>
        <div className="skeleton" style={{ aspectRatio: '4/3' }} />
        <div style={{ padding: '1.1rem 1.25rem 1.25rem' }}>
            <div className="skeleton" style={{ height: '10px', width: '50%', marginBottom: '10px' }} />
            <div className="skeleton" style={{ height: '18px', width: '85%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '18px', width: '65%', marginBottom: '16px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '12px' }}>
                <div className="skeleton" style={{ height: '20px', width: '70px' }} />
                <div className="skeleton" style={{ height: '20px', width: '40px' }} />
            </div>
        </div>
    </div>
)

export const ProductsGridSkeleton = ({ count = 8 }) => (
    <Row>
        {[...Array(count)].map((_, index) => (
            <Col key={index} sm={6} md={6} lg={4} xl={3} className="mb-4">
                <ProductCardSkeleton />
            </Col>
        ))}
    </Row>
)

export const TableRowSkeleton = ({ columns = 6 }) => (
    <tr>
        {[...Array(columns)].map((_, index) => (
            <td key={index} style={{ padding: '0.9rem 1.25rem' }}>
                <div className="skeleton" style={{
                    height: '14px',
                    width: index === 0 ? '60px' : index === columns - 1 ? '100px' : '120px'
                }} />
            </td>
        ))}
    </tr>
)

export const ProfileInfoSkeleton = () => (
    <div style={{
        background: '#161512',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '1.5rem'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: '16px', width: '140px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '13px', width: '100px' }} />
            </div>
        </div>
        {[...Array(4)].map((_, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
                <div className="skeleton" style={{ height: '10px', width: '80px', marginBottom: '6px' }} />
                <div className="skeleton" style={{ height: '14px', width: '60%' }} />
            </div>
        ))}
    </div>
)

// Product Card Skeleton