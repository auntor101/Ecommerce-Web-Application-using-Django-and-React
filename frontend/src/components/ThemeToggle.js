import React, { useState, useEffect } from 'react'

function ThemeToggle() {
    const [dark, setDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
        localStorage.setItem('theme', dark ? 'dark' : 'light')
    }, [dark])

    return (
        <button
            className="theme-toggle"
            onClick={() => setDark(d => !d)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Light mode' : 'Dark mode'}
        >
            {dark ? (
                <i className="fas fa-sun" />
            ) : (
                <i className="fas fa-moon" />
            )}
        </button>
    )
}

export default ThemeToggle
