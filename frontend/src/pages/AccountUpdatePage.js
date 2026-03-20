import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userDetails, userUpdateDetails, checkTokenValidation, logout } from '../actions/userActions'
import { Spinner } from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import { UPDATE_USER_DETAILS_RESET } from '../constants'


function AccountUpdatePage() {

    let history = useHistory()
    const dispatch = useDispatch()
  

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // user details reducer
    const userDetailsReducer = useSelector(state => state.userDetailsReducer)
    const { user: userAccDetails, loading } = userDetailsReducer

    // user update details reducer
    const userDetailsUpdateReducer = useSelector(state => state.userDetailsUpdateReducer)
    const { success } = userDetailsUpdateReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        }
        dispatch(checkTokenValidation())
        dispatch(userDetails(userInfo.id))
    }, [dispatch, history, userInfo])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
      }

    const onSubmit = (e) => {
        e.preventDefault()
        const updatedUsername = username === "" ? userAccDetails.username : username
        const updatedEmail = email === "" ? userAccDetails.email : email

        if (password !== confirmPassword) {
            alert("Passwords do not match")
        } else {
            const userData = {
                'username': updatedUsername,
                'email': updatedEmail,
                'password': password,
            }
            dispatch(userUpdateDetails(userData))
        }
    }

    // logout
    const logoutHandler = () => {
        history.push("/login")
        dispatch(logout()) // action        
    }

    if(success) {
        alert("Account successfully updated.")
        dispatch({
            type: UPDATE_USER_DETAILS_RESET
        })
        history.push("/account/")
        dispatch(userDetails(userInfo.id))
    }

    try {
        return (
            <div className="page-wrapper fade-in">
                <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem', maxWidth: 580 }}>
                    <div className="section-label" style={{ marginBottom: '0.5rem' }}>
                        <div className="section-red-bar" />
                        <span className="section-eyebrow">My Account</span>
                    </div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,3vw,32px)', color: 'var(--black)', marginBottom: '2rem' }}>
                        Edit Your Profile
                    </h1>

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <Spinner animation="border" style={{ color: 'var(--primary)' }} />
                        </div>
                    )}

                    {userAccDetails && (
                        <div className="content-card" style={{ padding: '2rem' }}>
                            <form onSubmit={onSubmit}>
                                <div className="row g-3" style={{ marginBottom: '1rem' }}>
                                    <div className="col-12">
                                        <div className="form-group-custom">
                                            <label className="form-label-custom">Username</label>
                                            <input
                                                type="text"
                                                autoFocus
                                                defaultValue={userAccDetails.username}
                                                placeholder="Username"
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="form-input-custom"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-group-custom">
                                            <label className="form-label-custom">Email Address</label>
                                            <input
                                                type="email"
                                                defaultValue={userAccDetails.email}
                                                placeholder="Email address"
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="form-input-custom"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group-custom">
                                            <label className="form-label-custom">New Password</label>
                                            <input
                                                type="password"
                                                placeholder="New password (optional)"
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="form-input-custom"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group-custom">
                                            <label className="form-label-custom">Confirm Password</label>
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="form-input-custom"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                    <button type="submit" className="btn-primary-red">
                                        Save Changes
                                    </button>
                                    <Link to="/account">
                                        <button
                                            type="button"
                                            style={{
                                                height: 44, padding: '0 1.5rem', background: 'transparent',
                                                border: '1.5px solid var(--border)', borderRadius: 6,
                                                fontWeight: 500, cursor: 'pointer', color: 'var(--text-primary)',
                                                transition: 'all .2s'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        )
    } catch (error) {
        return (
            <div className="page-wrapper fade-in">
                <div className="container" style={{ paddingTop: '2rem' }}>
                    <div className="content-card" style={{ padding: '2rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Something went wrong.</p>
                        <Link to="/login" onClick={logoutHandler} className="btn-primary-red" style={{ textDecoration: 'none' }}>
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default AccountUpdatePage
