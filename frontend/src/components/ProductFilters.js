import React, { useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'

function ProductFilters({ onFiltersChange, products }) {
    const [filters, setFilters] = useState({
        priceRange: [0, 50000],
        category: '',
        stockStatus: 'all',
        rating: 0,
        sortBy: 'name'
    })

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
    const maxPrice = Math.max(...products.map(p => parseInt(p.price) || 0))

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onFiltersChange(newFilters)
    }

    const clearFilters = () => {
        const defaultFilters = {
            priceRange: [0, maxPrice],
            category: '',
            stockStatus: 'all',
            rating: 0,
            sortBy: 'name'
        }
        setFilters(defaultFilters)
        onFiltersChange(defaultFilters)
    }

    return (
        <Card style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem',
            marginBottom: '2rem'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h4 style={{ 
                    margin: 0,
                    fontWeight: '700',
                    color: '#2d3748',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <i className="fas fa-filter" style={{ marginRight: '10px', color: '#667eea' }}></i>
                    Filters
                </h4>
                <Button
                    onClick={clearFilters}
                    style={{
                        background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                    }}
                >
                    <i className="fas fa-times" style={{ marginRight: '6px' }}></i>
                    Clear
                </Button>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1.5rem' 
            }}>
                {/* Price Range */}
                <div>
                    <Form.Label style={{ fontWeight: '600', color: '#4a5568', marginBottom: '0.75rem' }}>
                        <i className="fas fa-dollar-sign" style={{ marginRight: '8px', color: '#11998e' }}></i>
                        Price Range
                    </Form.Label>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <Form.Range
                            min={0}
                            max={maxPrice}
                            value={filters.priceRange[1]}
                            onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                        />
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: '#667eea'
                    }}>
                        <span>৳0</span>
                        <span>৳{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                </div>

                {/* Category */}
                <div>
                    <Form.Label style={{ fontWeight: '600', color: '#4a5568', marginBottom: '0.75rem' }}>
                        <i className="fas fa-tags" style={{ marginRight: '8px', color: '#36d1dc' }}></i>
                        Category
                    </Form.Label>
                    <Form.Select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        style={{
                            borderRadius: '8px',
                            border: '2px solid rgba(102, 126, 234, 0.2)',
                            fontWeight: '500'
                        }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </Form.Select>
                </div>

                {/* Stock Status */}
                <div>
                    <Form.Label style={{ fontWeight: '600', color: '#4a5568', marginBottom: '0.75rem' }}>
                        <i className="fas fa-boxes" style={{ marginRight: '8px', color: '#11998e' }}></i>
                        Availability
                    </Form.Label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {[
                            { value: 'all', label: 'All', color: '#667eea' },
                            { value: 'inStock', label: 'In Stock', color: '#11998e' },
                            { value: 'outOfStock', label: 'Out of Stock', color: '#ff416c' }
                        ].map(status => (
                            <button
                                key={status.value}
                                onClick={() => handleFilterChange('stockStatus', status.value)}
                                style={{
                                    background: filters.stockStatus === status.value ? 
                                        status.color : 'transparent',
                                    color: filters.stockStatus === status.value ? 'white' : status.color,
                                    border: `2px solid ${status.color}`,
                                    borderRadius: '8px',
                                    padding: '6px 12px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort By */}
                <div>
                    <Form.Label style={{ fontWeight: '600', color: '#4a5568', marginBottom: '0.75rem' }}>
                        <i className="fas fa-sort" style={{ marginRight: '8px', color: '#764ba2' }}></i>
                        Sort By
                    </Form.Label>
                    <Form.Select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        style={{
                            borderRadius: '8px',
                            border: '2px solid rgba(102, 126, 234, 0.2)',
                            fontWeight: '500'
                        }}
                    >
                        <option value="name">Name (A-Z)</option>
                        <option value="price-low">Price (Low to High)</option>
                        <option value="price-high">Price (High to Low)</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest First</option>
                    </Form.Select>
                </div>
            </div>
        </Card>
    )
}

export default ProductFilters