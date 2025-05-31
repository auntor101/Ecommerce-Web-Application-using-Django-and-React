import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { register } from '../actions/userActions'
import Message from '../components/Message'

function RegisterPage({ history }) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")

    const dispatch = useDispatch()
    const userRegisterReducer = useSelector(state => state.userRegisterReducer)
    const { error, userInfo } = userRegisterReducer

    useEffect(() => {
        if (userInfo) {
            history.push('/')
        }
    }, [history, userInfo])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match!')
        } else {
            dispatch(register(username, email, password))
        }
    }

    return (
        <div className="fade-in" style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            display: 'flex',
            alignItems: 'center',
            padding: '2rem 0'
        }}>
            <div className="container">
                <Row className='justify-content-center'>
                    <Col xs={12} md={6} lg={5}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '24px',
                            padding: '3rem',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            {/* Header */}
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                    borderRadius: '50%',
                                    margin: '0 auto 1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 10px 30px rgba(17, 153, 142, 0.4)'
                                }}>
                                    <i className="fas fa-user-plus" style={{ fontSize: '2rem', color: 'white' }}></i>
                                </div>
                                
                                <h1 style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '700',
                                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    margin: 0
                                }}>
                                    Join Us Today
                                </h1>
                                <p style={{ color: '#6b7280', margin: '0.5rem 0 0', fontSize: '1.1rem' }}>
                                    Create your account to start shopping
                                </p>
                            </div>

                            {/* Error Messages */}
                            {message && <div style={{ marginBottom: '1.5rem' }}><Message variant='danger'>{message}</Message></div>}
                            {error && <div style={{ marginBottom: '1.5rem' }}><Message variant='danger'>{error}</Message></div>}

                            {/* Register Form */}
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='name' style={{ marginBottom: '1.5rem' }}>
                                    <Form.Label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                        <i className="fas fa-user" style={{ marginRight: '8px', color: '#11998e' }}></i>
                                        Username
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        style={{
                                            borderRadius: '12px',
                                            border: '2px solid rgba(17, 153, 142, 0.2)',
                                            padding: '14px 16px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group controlId='email' style={{ marginBottom: '1.5rem' }}>
                                    <Form.Label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                        <i className="fas fa-envelope" style={{ marginRight: '8px', color: '#11998e' }}></i>
                                        Email Address
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            borderRadius: '12px',
                                            border: '2px solid rgba(17, 153, 142, 0.2)',
                                            padding: '14px 16px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group controlId='password' style={{ marginBottom: '1.5rem' }}>
                                    <Form.Label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                        <i className="fas fa-lock" style={{ marginRight: '8px', color: '#11998e' }}></i>
                                        Password
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{
                                            borderRadius: '12px',
                                            border: '2px solid rgba(17, 153, 142, 0.2)',
                                            padding: '14px 16px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group controlId='passwordConfirm' style={{ marginBottom: '2rem' }}>
                                    <Form.Label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                        <i className="fas fa-check" style={{ marginRight: '8px', color: '#11998e' }}></i>
                                        Confirm Password
                                    </Form.Label>
                                    <Form.Control
                                        required
                                        type="password"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{
                                            borderRadius: '12px',
                                            border: '2px solid rgba(17, 153, 142, 0.2)',
                                            padding: '14px 16px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    />
                                </Form.Group>

                                <Button 
                                    type="submit" 
                                    style={{
                                        width: '100%',
                                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        fontSize: '1.1rem',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 8px 25px rgba(17, 153, 142, 0.4)',
                                        marginBottom: '1.5rem'
                                    }}
                                    className="register-btn"
                                >
                                    <i className="fas fa-user-plus" style={{ marginRight: '10px' }}></i>
                                    Create Account
                                </Button>
                            </Form>

                            {/* Login Link */}
                            <div style={{ 
                                textAlign: 'center',
                                padding: '1.5rem 0',
                                borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                            }}>
                                <span style={{ color: '#6b7280', fontSize: '1rem' }}>
                                    Already have an account?{' '}
                                </span>
                                <Link
                                    to="/login"
                                    style={{
                                        color: '#11998e',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                    className="login-link"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <style jsx>{`
                .register-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(17, 153, 142, 0.6) !important;
                }
                
                .login-link:hover {
                    color: #38ef7d !important;
                    text-decoration: underline !important;
                }
                
                .form-control:focus {
                    border-color: #11998e !important;
                    box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.15) !important;
                    transform: translateY(-1px);
                }
            `}</style>
        </div>
    )
}

export default RegisterPage