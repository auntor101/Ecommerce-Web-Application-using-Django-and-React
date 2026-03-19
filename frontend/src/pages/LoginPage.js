import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
import { login } from '../actions/userActions'
import Message from '../components/Message';

function LoginPage({ history }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()

    // reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { error, userInfo } = userLoginReducer

    useEffect(() => {
        if (userInfo) {
            history.push('/') // homepage
        }
    }, [history, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(username, password))
    }

    return (
        <div className="auth-page">
            <div className="container">
                <div className="row justify-content-center">
                    <Col xs={12} md={7} lg={5}>
                        <div className="auth-card">
                            {/* Header */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div className="section-eyebrow">Welcome back</div>
                                <h1 className="auth-title">Sign In</h1>
                                <p className="auth-subtitle">Continue to Auntor Shopping Mall</p>
                            </div>

                            {error && <Message variant='danger'>{error}</Message>}

                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='username' className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId='password' className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" style={{ width: '100%', padding: '0.75rem' }}>
                                    Sign In
                                </Button>
                            </Form>

                            <div className="auth-link-row">
                                Don't have an account?{' '}
                                <Link to="/register">Create one</Link>
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
                                <Form.Group controlId='username' style={{ marginBottom: '1.5rem' }}>
                                    <Form.Label style={{ 
                                        fontWeight: '600', 
                                        color: '#2d3748',
                                        marginBottom: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="fas fa-user" style={{ marginRight: '8px', color: '#667eea' }}></i>
                                        Username
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={{
                                            borderRadius: '12px',
                                            border: '2px solid rgba(102, 126, 234, 0.2)',
                                            padding: '14px 16px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group controlId='password' style={{ marginBottom: '2rem' }}>
                                    <Form.Label style={{ 
                                        fontWeight: '600', 
                                        color: '#2d3748',
                                        marginBottom: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <i className="fas fa-lock" style={{ marginRight: '8px', color: '#667eea' }}></i>
                                        Password
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            borderRadius: '12px',
                                            border: '2px solid rgba(102, 126, 234, 0.2)',
                                            padding: '14px 16px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                        required
                                    />
                                </Form.Group>

                                <Button 
                                    type="submit" 
                                    style={{
                                        width: '100%',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                        marginBottom: '1.5rem'
                                    }}
                                    className="login-btn"
                                >
                                    <i className="fas fa-sign-in-alt" style={{ marginRight: '10px' }}></i>
                                    Sign In
                                </Button>
                            </Form>

                            {/* Register Link */}
                            <div style={{ 
                                textAlign: 'center',
                                padding: '1.5rem 0',
                                borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                            }}>
                                <span style={{ color: '#6b7280', fontSize: '1rem' }}>
                                    Don't have an account?{' '}
                                </span>
                                <Link
                                    to="/register"
                                    style={{
                                        color: '#667eea',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="register-link"
                                >
                                    Create Account
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <style jsx>{`
                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6) !important;
                }
                
                .register-link:hover {
                    color: #764ba2 !important;
                    text-decoration: underline !important;
                }
                
                .form-control:focus {
                    border-color: #667eea !important;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15) !important;
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    )
}

export default LoginPage