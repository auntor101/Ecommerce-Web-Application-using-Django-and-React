import React from 'react'
import { Alert } from 'react-bootstrap'

function Message({ variant, children }) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    background: 'linear-gradient(135deg, rgba(255, 65, 108, 0.1) 0%, rgba(255, 75, 43, 0.1) 100%)',
                    color: '#e53e3e',
                    borderLeft: '4px solid #ff416c',
                    icon: 'exclamation-triangle'
                }
            case 'success':
                return {
                    background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%)',
                    color: '#38a169',
                    borderLeft: '4px solid #11998e',
                    icon: 'check-circle'
                }
            case 'info':
                return {
                    background: 'linear-gradient(135deg, rgba(54, 209, 220, 0.1) 0%, rgba(91, 134, 229, 0.1) 100%)',
                    color: '#3182ce',
                    borderLeft: '4px solid #36d1dc',
                    icon: 'info-circle'
                }
            case 'warning':
                return {
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)',
                    color: '#d69e2e',
                    borderLeft: '4px solid #fbbf24',
                    icon: 'exclamation-circle'
                }
            default:
                return {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    color: '#667eea',
                    borderLeft: '4px solid #667eea',
                    icon: 'info-circle'
                }
        }
    }

    const styles = getVariantStyles()

    return (
        <Alert 
            variant={variant}
            style={{
                borderRadius: '16px',
                border: 'none',
                padding: '16px 20px',
                fontWeight: '500',
                backdropFilter: 'blur(10px)',
                marginBottom: '1.5rem',
                ...styles,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.3s ease'
            }}
            className="modern-alert"
        >
            <i 
                className={`fas fa-${styles.icon}`} 
                style={{ 
                    marginRight: '12px', 
                    fontSize: '1.2rem',
                    opacity: 0.8
                }}
            ></i>
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </Alert>
    )
}

export default Message