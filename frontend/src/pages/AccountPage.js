import React, { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userDetails, logout, checkTokenValidation } from '../actions/userActions'
import { Spinner } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

function AccountPage() {
    let history = useHistory()
    const dispatch = useDispatch()

    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const userDetailsReducer = useSelector(state => state.userDetailsReducer)
    const { user: userAccDetails, loading } = userDetailsReducer

    useEffect(() => {
        if (!userInfo) { history.push("/login") }
        else {
            dispatch(checkTokenValidation())
            dispatch(userDetails(userInfo.id))
        }
    }, [history, userInfo, dispatch])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout()); history.push("/login"); window.location.reload()
    }

    const logoutHandler = () => dispatch(logout())

    const initial = (userAccDetails?.username || userInfo?.username || "?")[0].toUpperCase()

    return (
        <div className="page-wrapper fade-in account-page">
            <div className="container page-pad-y account-page-shell">

                {loading ? (
                    <div className="page-loading">
                        <Spinner animation="border" className="page-loading-spinner" />
                    </div>
                ) : (
                    <>
                        <div className="content-card account-profile-card">
                            <div className="account-avatar">{initial}</div>
                            <h2 className="account-profile-name">
                                {userAccDetails?.username || userInfo?.username}
                            </h2>
                            <p className="account-profile-email">
                                {userAccDetails?.email || userInfo?.email}
                            </p>
                            {userInfo?.admin && (
                                <span className="product-badge account-admin-badge">Admin</span>
                            )}
                        </div>

                        <div className="content-card account-details-card">
                            <div className="content-card-header account-details-head">
                                <span className="section-eyebrow">Profile</span>
                                <h3>Account Details</h3>
                            </div>
                            <Row className="account-details-grid">
                                {[
                                    { label: 'Username', value: userAccDetails?.username || '—' },
                                    { label: 'Email', value: userAccDetails?.email || '—' },
                                    { label: 'Role', value: userInfo?.admin ? 'Administrator' : 'Customer' },
                                    { label: 'Member Since', value: userAccDetails?.date_joined ? new Date(userAccDetails.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—' },
                                ].map(item => (
                                    <Col key={item.label} md={6}>
                                        <div className="account-detail-item">
                                            <div className="account-detail-label">{item.label}</div>
                                            <div className="account-detail-value">{item.value}</div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        <div className="content-card account-actions-card">
                            <div className="account-action-list">
                                <Link to="/all-orders/" className="account-action-link">
                                    <button className="account-action-btn">
                                        <i className="fas fa-shopping-bag" />
                                        My Orders
                                    </button>
                                </Link>
                                {userInfo?.admin && (
                                    <Link to="/new-product/" className="account-action-link">
                                        <button className="account-action-btn">
                                            <i className="fas fa-boxes" />
                                            Add Product
                                        </button>
                                    </Link>
                                )}
                                {userInfo?.admin && (
                                    <Link to="/admin/site-settings/" className="account-action-link">
                                        <button className="account-action-btn">
                                            <i className="fas fa-image" />
                                            Site Settings & Background Images
                                        </button>
                                    </Link>
                                )}
                                <button
                                    onClick={logoutHandler}
                                    className="account-action-btn danger"
                                >
                                    <i className="fas fa-sign-out-alt" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AccountPage
