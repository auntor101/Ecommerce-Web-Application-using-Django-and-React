import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            errorMessage: ''
        }
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            errorMessage: error?.message || 'Unexpected application error'
        }
    }

    componentDidCatch(error, errorInfo) {
        console.error('Application render failed:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                }}>
                    <div style={{
                        maxWidth: '720px',
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '20px',
                        padding: '2rem',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <h2 style={{ marginTop: 0, color: '#e53e3e' }}>
                            The app hit a runtime error
                        </h2>
                        <p style={{ color: '#4a5568', lineHeight: 1.6 }}>
                            This usually means the frontend rendered data or browser state in an unexpected shape.
                        </p>
                        <pre style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            background: '#fff5f5',
                            color: '#c53030',
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '1rem'
                        }}>
                            {this.state.errorMessage}
                        </pre>
                        <p style={{ color: '#4a5568', marginBottom: 0 }}>
                            Reload the page. If this persists, check the browser console and API configuration.
                        </p>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary