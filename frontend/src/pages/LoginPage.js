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
