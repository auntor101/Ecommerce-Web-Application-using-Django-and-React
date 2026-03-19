import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Button, Col } from 'react-bootstrap'
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
            <div className="container">
                <div className="row justify-content-center">
                    <Col xs={12} md={7} lg={5}>
                        <div className="auth-card">
                            <div style={{ marginBottom: '2rem' }}>
                                <div className="section-eyebrow">Get started</div>
                                <h1 className="auth-title">Create Account</h1>
                                <p className="auth-subtitle">Join Auntor Shopping Mall</p>
                            </div>

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

                            <div className="auth-link-row">
                                Already have an account?{' '}
                                <Link to="/login">Sign In</Link>
                            </div>
                        </div>
                    </Col>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
