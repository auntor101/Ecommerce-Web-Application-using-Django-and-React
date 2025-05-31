import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function SearchBarForProducts() {
    let history = useHistory()
    const [searchTerm, setSearchTerm] = useState("")

    const onSubmit = (e) => {
        e.preventDefault();
        if(searchTerm) {
            history.push(`/?searchTerm=${searchTerm}`)
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div style={{
                    display: "flex",
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                }} className="search-container">
                    <input
                        type="text"
                        value={searchTerm}
                        placeholder="Search products..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '12px 16px',
                            border: 'none',
                            background: 'transparent',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                        className="search-input"
                    />
                    <button
                        type="submit"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            padding: '12px 16px',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className="search-button"
                    >
                        <i className="fas fa-search" style={{ fontSize: '1rem' }}></i>
                    </button>
                </div>
            </form>

            <style jsx>{`
                .search-container:focus-within {
                    background: rgba(255, 255, 255, 0.25);
                    border-color: rgba(255, 255, 255, 0.4);
                    transform: scale(1.02);
                }
                
                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .search-button:hover {
                    background: linear-gradient(135deg, #5a6fd8 0%, #6b3fa0 100%);
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    )
}

export default SearchBarForProducts