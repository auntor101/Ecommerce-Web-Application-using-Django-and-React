import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userDetails, logout, checkTokenValidation } from '../actions/userActions'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

function AccountPage() {
    let history = useHistory()
    const dispatch = useDispatch()

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // user details reducer
    const userDetailsReducer = useSelector(state => state.userDetailsReducer)
    const { user: userAccDetails, loading } = userDetailsReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            try {
                dispatch(checkTokenValidation())
                dispatch(userDetails(userInfo.id))
            } catch (error) {
                history.push("/")
            }
        }
    }, [history, userInfo, dispatch])

    // logout
    const logoutHandler = () => {
        dispatch(logout()) // action
    }

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const renderData = () => {
        try {
            return (
                <div className="fade-in" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                    <Container style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                        {/* Header Section */}
                        <div 
                            style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '24px',
                                padding: '2rem',
                                marginBottom: '2rem',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                textAlign: 'center'
                            }}
                        >
                            <div 
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '50%',
                                    margin: '0 auto 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
                                }}
                            >
                                <i className="fas fa-user" style={{ fontSize: '3rem', color: 'white' }}></i>
                            </div>
                            <h1 style={{ 
                                margin: 0,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontSize: '2.5rem',
                                fontWeight: '700'
                            }}>
                                Account Dashboard
                            </h1>
                            <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: '0.5rem 0 0' }}>
                                Manage your account settings and preferences
                            </p>
                        </div>

                        <Row>
                            {/* Profile Info Section */}
                            <Col lg={8} className="mb-4">
                                <div 
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '20px',
                                        padding: '2rem',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        height: '100%'
                                    }}
                                >
                                    <h3 style={{ 
                                        marginBottom: '2rem',
                                        color: '#2d3748',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="fas fa-user-circle" style={{ marginRight: '12px', color: '#667eea' }}></i>
                                        Profile Information
                                    </h3>

                                    {loading && (
                                        <div style={{ display: "flex", alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                                            <Spinner 
                                                animation="border" 
                                                style={{ 
                                                    color: '#667eea',
                                                    width: '3rem',
                                                    height: '3rem'
                                                }}
                                            />
                                            <span style={{ marginLeft: '1rem', fontWeight: '600', color: '#667eea' }}>
                                                Loading Profile...
                                            </span>
                                        </div>
                                    )}

                                    {!loading && userAccDetails && (
                                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                                            <div 
                                                style={{
                                                    display: 'flex',
                                                    padding: '1.5rem',
                                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                                                    borderRadius: '16px',
                                                    border: '1px solid rgba(102, 126, 234, 0.1)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                className="info-card"
                                            >
                                                <div style={{ flex: '0 0 140px', fontWeight: '700', color: '#667eea' }}>
                                                    <i className="fas fa-signature" style={{ marginRight: '8px' }}></i>
                                                    Username:
                                                </div>
                                                <div style={{ flex: 1, fontWeight: '600', color: '#2d3748' }}>
                                                    {userAccDetails.username}
                                                </div>
                                            </div>

                                            <div 
                                                style={{
                                                    display: 'flex',
                                                    padding: '1.5rem',
                                                    background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.05) 0%, rgba(56, 239, 125, 0.05) 100%)',
                                                    borderRadius: '16px',
                                                    border: '1px solid rgba(17, 153, 142, 0.1)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                className="info-card"
                                            >
                                                <div style={{ flex: '0 0 140px', fontWeight: '700', color: '#11998e' }}>
                                                    <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                                                    Email:
                                                </div>
                                                <div style={{ flex: 1, fontWeight: '600', color: '#2d3748' }}>
                                                    {userAccDetails.email}
                                                </div>
                                            </div>

                                            <div 
                                                style={{
                                                    display: 'flex',
                                                    padding: '1.5rem',
                                                    background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)',
                                                    borderRadius: '16px',
                                                    border: '1px solid rgba(118, 75, 162, 0.1)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                className="info-card"
                                            >
                                                <div style={{ flex: '0 0 140px', fontWeight: '700', color: '#764ba2' }}>
                                                    <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
                                                    Admin Status:
                                                </div>
                                                <div style={{ flex: 1, fontWeight: '600', color: '#2d3748' }}>
                                                    {userAccDetails.admin ? (
                                                        <span style={{ 
                                                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                                            color: 'white',
                                                            padding: '6px 12px',
                                                            borderRadius: '8px',
                                                            fontSize: '0.9rem'
                                                        }}>
                                                            <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
                                                            Administrator
                                                        </span>
                                                    ) : (
                                                        <span style={{ 
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            color: 'white',
                                                            padding: '6px 12px',
                                                            borderRadius: '8px',
                                                            fontSize: '0.9rem'
                                                        }}>
                                                            <i className="fas fa-user" style={{ marginRight: '6px' }}></i>
                                                            Standard User
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Col>

                            {/* Quick Actions Section */}
                            <Col lg={4} className="mb-4">
                                <div 
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '20px',
                                        padding: '2rem',
                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        height: '100%'
                                    }}
                                >
                                    <h3 style={{ 
                                        marginBottom: '2rem',
                                        color: '#2d3748',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="fas fa-cogs" style={{ marginRight: '12px', color: '#667eea' }}></i>
                                        Quick Actions
                                    </h3>

                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        <Link 
                                            to={`/account/update`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <button
                                                style={{
                                                    width: '100%',
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    padding: '16px',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                                                }}
                                                className="action-btn"
                                            >
                                                <i className="fas fa-edit" style={{ marginRight: '10px' }}></i>
                                                Update Account
                                            </button>
                                        </Link>

                                        <Link 
                                            to={`/all-addresses/`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <button
                                                style={{
                                                    width: '100%',
                                                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    padding: '16px',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 8px 25px rgba(17, 153, 142, 0.3)'
                                                }}
                                                className="action-btn"
                                            >
                                                <i className="fas fa-map-marker-alt" style={{ marginRight: '10px' }}></i>
                                                Manage Addresses
                                            </button>
                                        </Link>

                                        <Link 
                                            to={`/all-orders/`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <button
                                                style={{
                                                    width: '100%',
                                                    background: 'linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    padding: '16px',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 8px 25px rgba(54, 209, 220, 0.3)'
                                                }}
                                                className="action-btn"
                                            >
                                                <i className="fas fa-shopping-bag" style={{ marginRight: '10px' }}></i>
                                                Order History
                                            </button>
                                        </Link>

                                        <hr style={{ margin: '1.5rem 0', border: 'none', height: '1px', background: 'rgba(0,0,0,0.1)' }} />

                                        <Link 
                                            to={`/account/delete/`}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <button
                                                style={{
                                                    width: '100%',
                                                    background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    color: 'white',
                                                    padding: '16px',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 8px 25px rgba(255, 65, 108, 0.3)'
                                                }}
                                                className="action-btn"
                                            >
                                                <i className="fas fa-trash-alt" style={{ marginRight: '10px' }}></i>
                                                Delete Account
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>

                    <style jsx>{`
                        .info-card:hover {
                            transform: translateY(-4px);
                            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
                        }
                        
                        .action-btn:hover {
                            transform: translateY(-3px);
                            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25) !important;
                        }
                    `}</style>
                </div>
            )
        } catch (error) {
            return (
                <Message variant='danger'>
                    Something went wrong, go back to{' '}
                    <Link onClick={logoutHandler} to={`/login`}>
                        Login
                    </Link>{' '}
                    page.
                </Message>
            )
        }
    }

    return renderData()
}

export default AccountPage