import React, { useState } from 'react'

function SearchBarForOrdersPage({ handleSearchTerm, placeholderValue }) {
    const [searchTerm, setSearchTerm] = useState('')

    const onChangeHandler = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        handleSearchTerm(value.toLowerCase())
    }

    return (
        <div style={{
            display: 'flex',
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.08)'
        }}>
            <input
                type="text"
                value={searchTerm}
                placeholder={placeholderValue}
                onChange={onChangeHandler}
                style={{
                    flex: 1,
                    padding: '14px 16px',
                    border: 'none',
                    background: 'transparent',
                    color: '#1f2937',
                    fontSize: '1rem',
                    outline: 'none'
                }}
            />
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '0 18px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <i className="fas fa-search"></i>
            </div>
        </div>
    )
}

export default SearchBarForOrdersPage
