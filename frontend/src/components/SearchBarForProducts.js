import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function SearchBarForProducts() {
    let history = useHistory()
    const [searchTerm, setSearchTerm] = useState("")

    const onSubmit = (e) => {
        e.preventDefault()
        if (searchTerm) {
            history.push(`/?searchTerm=${searchTerm}`)
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="search-wrap">
                <input
                    type="text"
                    value={searchTerm}
                    placeholder="Search..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                    <i className="fas fa-search" style={{ fontSize: '11px' }} />
                </button>
            </div>
        </form>
    )
}

export default SearchBarForProducts