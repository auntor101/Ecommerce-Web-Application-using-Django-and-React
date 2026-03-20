import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
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
        <div className="auth-page">
            <div className="auth-split">
                <div className="auth-image-panel">
                    <img
                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"
                        alt="Shopping experience"
                    />
                </div>
                <div className="auth-form-panel">
                    <div className="auth-card">
                        <h1 className="auth-title">Create an Account</h1>
                        <p className="auth-subtitle">Enter your details below</p>

                        {message && <Message variant='danger'>{message}</Message>}
                        {error && <Message variant='danger'>{error}</Message>}

                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name' className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    required type="text"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId='email' className="mb-3">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    required type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId='password' className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group controlId='passwordConfirm' className="mb-4">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    required type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" style={{ width: '100%', padding: '0.75rem' }}>
                                Create Account
                            </Button>
                        </Form>

                        <div className="auth-divider">
                            <span>OR</span>
                        </div>

                        <button className="google-btn" type="button">
                            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Sign up with Google
                        </button>

                        <div className="auth-link-row">
                            Already have an account?{' '}
                            <Link to="/login">Log In</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
