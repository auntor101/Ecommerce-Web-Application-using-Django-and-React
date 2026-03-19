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
        <div className="page-wrapper fade-in">
            <div className="container" style={{ paddingTop: '3rem', maxWidth: 800 }}>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <Spinner animation="border" style={{ color: 'var(--accent)' }} />
                    </div>
                ) : (
                    <>
                        {/* Profile header */}
                        <div className="content-card" style={{ textAlign: 'center', marginBottom: '2rem', padding: '3rem 2rem' }}>
                            <div className="account-avatar">{initial}</div>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--text-primary)', margin: '0.5rem 0 0.25rem' }}>
                                {userAccDetails?.username || userInfo?.username}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                                {userAccDetails?.email || userInfo?.email}
                            </p>
                            {userInfo?.admin && (
                                <span className="product-badge" style={{ marginTop: '0.75rem', display: 'inline-block' }}>Admin</span>
                            )}
                        </div>

                        {/* Details card */}
                        <div className="content-card" style={{ marginBottom: '1.5rem' }}>
                            <div className="content-card-header" style={{ marginBottom: '1.5rem' }}>
                                <span className="section-eyebrow">Profile</span>
                                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: 0 }}>Account Details</h3>
                            </div>
                            <Row style={{ rowGap: '1rem' }}>
                                {[
                                    { label: 'Username', value: userAccDetails?.username || '—' },
                                    { label: 'Email', value: userAccDetails?.email || '—' },
                                    { label: 'Role', value: userInfo?.admin ? 'Administrator' : 'Customer' },
                                    { label: 'Member Since', value: userAccDetails?.date_joined ? new Date(userAccDetails.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—' },
                                ].map(item => (
                                    <Col key={item.label} md={6}>
                                        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{item.label}</div>
                                            <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </div>

                        {/* Actions card */}
                        <div className="content-card">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <Link to="/all-orders/" style={{ textDecoration: 'none' }}>
                                    <button className="btn w-100" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'border-color 0.2s' }}>
                                        <i className="fas fa-shopping-bag" style={{ color: 'var(--accent)', width: 20 }} />
                                        My Orders
                                    </button>
                                </Link>
                                {userInfo?.admin && (
                                    <Link to="/new-product/" style={{ textDecoration: 'none' }}>
                                        <button className="btn w-100" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <i className="fas fa-boxes" style={{ color: 'var(--accent)', width: 20 }} />
                                            Add Product
                                        </button>
                                    </Link>
                                )}
                                {userInfo?.admin && (
                                    <Link to="/admin/site-settings/" style={{ textDecoration: 'none' }}>
                                        <button className="btn w-100" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <i className="fas fa-image" style={{ color: 'var(--accent)', width: 20 }} />
                                            Site Settings & Background Images
                                        </button>
                                    </Link>
                                )}
                                <button
                                    onClick={logoutHandler}
                                    className="btn w-100"
                                    style={{ background: 'transparent', border: '1px solid rgba(220,53,69,0.4)', color: '#dc3545', padding: '0.85rem', borderRadius: 'var(--radius-md)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s' }}
                                >
                                    <i className="fas fa-sign-out-alt" style={{ width: 20 }} />
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
