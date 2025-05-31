import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'

// Product Card Skeleton
export const ProductCardSkeleton = () => (
    <Card style={{
        borderRadius: '20px',
        border: 'none',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
    }}>
        <div className="skeleton-shimmer" style={{
            height: '200px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
        }} />
        <Card.Body style={{ padding: '1.5rem' }}>
            <div className="skeleton-shimmer" style={{
                height: '20px',
                marginBottom: '12px',
                borderRadius: '4px',
                width: '80%'
            }} />
            <div className="skeleton-shimmer" style={{
                height: '16px',
                marginBottom: '12px',
                borderRadius: '4px',
                width: '60%'
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="skeleton-shimmer" style={{
                    height: '24px',
                    width: '80px',
                    borderRadius: '4px'
                }} />
                <div className="skeleton-shimmer" style={{
                    height: '36px',
                    width: '80px',
                    borderRadius: '8px'
                }} />
            </div>
        </Card.Body>
    </Card>
)

// Products Grid Skeleton
export const ProductsGridSkeleton = ({ count = 8 }) => (
    <Row>
        {[...Array(count)].map((_, index) => (
            <Col key={index} sm={12} md={6} lg={4} xl={3} className="mb-4">
                <ProductCardSkeleton />
            </Col>
        ))}
    </Row>
)

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 6 }) => (
    <tr>
        {[...Array(columns)].map((_, index) => (
            <td key={index} style={{ padding: '1.25rem' }}>
                <div className="skeleton-shimmer" style={{
                    height: '16px',
                    borderRadius: '4px',
                    width: index === 0 ? '60px' : index === columns - 1 ? '100px' : '120px'
                }} />
            </td>
        ))}
    </tr>
)

// Profile Info Skeleton
export const ProfileInfoSkeleton = () => (
    <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
    }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="skeleton-shimmer" style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                margin: '0 auto 1.5rem'
            }} />
            <div className="skeleton-shimmer" style={{
                height: '32px',
                width: '200px',
                margin: '0 auto 0.5rem',
                borderRadius: '4px'
            }} />
            <div className="skeleton-shimmer" style={{
                height: '16px',
                width: '160px',
                margin: '0 auto',
                borderRadius: '4px'
            }} />
        </div>
        {[...Array(3)].map((_, index) => (
            <div key={index} style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                borderRadius: '16px',
                border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
                <div className="skeleton-shimmer" style={{
                    height: '20px',
                    width: '100px',
                    marginBottom: '0.5rem',
                    borderRadius: '4px'
                }} />
                <div className="skeleton-shimmer" style={{
                    height: '16px',
                    width: '200px',
                    borderRadius: '4px'
                }} />
            </div>
        ))}
    </div>
)

// Form Skeleton
export const FormSkeleton = ({ fields = 4 }) => (
    <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
    }}>
        <div className="skeleton-shimmer" style={{
            height: '32px',
            width: '200px',
            marginBottom: '2rem',
            borderRadius: '4px'
        }} />
        {[...Array(fields)].map((_, index) => (
            <div key={index} style={{ marginBottom: '1.5rem' }}>
                <div className="skeleton-shimmer" style={{
                    height: '16px',
                    width: '100px',
                    marginBottom: '0.5rem',
                    borderRadius: '4px'
                }} />
                <div className="skeleton-shimmer" style={{
                    height: '48px',
                    width: '100%',
                    borderRadius: '8px'
                }} />
            </div>
        ))}
        <div className="skeleton-shimmer" style={{
            height: '48px',
            width: '120px',
            borderRadius: '8px',
            marginTop: '1rem'
        }} />
    </div>
)

// Stats Cards Skeleton
export const StatsCardsSkeleton = ({ count = 4 }) => (
    <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
    }}>
        {[...Array(count)].map((_, index) => (
            <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                        <div className="skeleton-shimmer" style={{
                            height: '16px',
                            width: '80px',
                            marginBottom: '0.5rem',
                            borderRadius: '4px'
                        }} />
                        <div className="skeleton-shimmer" style={{
                            height: '32px',
                            width: '60px',
                            borderRadius: '4px'
                        }} />
                    </div>
                    <div className="skeleton-shimmer" style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%'
                    }} />
                </div>
            </div>
        ))}
    </div>
)

// Generic Skeleton with custom styles
export const Skeleton = ({ 
    width = '100%', 
    height = '20px', 
    borderRadius = '4px',
    marginBottom = '0',
    className = ''
}) => (
    <div 
        className={`skeleton-shimmer ${className}`}
        style={{
            width,
            height,
            borderRadius,
            marginBottom,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
        }}
    />
)

// Add CSS for shimmer animation
const SkeletonStyles = () => (
    <style jsx global>{`
        @keyframes shimmer {
            0% {
                background-position: -200% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }
        
        .skeleton-shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
        }
    `}</style>
)

export default {
    ProductCardSkeleton,
    ProductsGridSkeleton,
    TableRowSkeleton,
    ProfileInfoSkeleton,
    FormSkeleton,
    StatsCardsSkeleton,
    Skeleton,
    SkeletonStyles
}