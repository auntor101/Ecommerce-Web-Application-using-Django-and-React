import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { useHistory } from "react-router-dom"
import SearchBarForProducts from './SearchBarForProducts'
import CartIcon from './CartIcon'
import { isFrontendOnlyMode } from '../utils/appMode'

function NavBar() {
    let history = useHistory()
    const dispatch = useDispatch()

    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const logoutHandler = () => {
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    return (
        <header className="slide-in">
            <Navbar expand="lg" variant="dark" collapseOnSelect>
                <Container fluid style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <span className="brand-dot" />
                            Auntor
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="main-nav" />

                    <Navbar.Collapse id="main-nav">
                        <Nav className="mr-auto align-items-lg-center">
                            <LinkContainer to="/">
                                <Nav.Link className="nav-link-atelier">Collection</Nav.Link>
                            </LinkContainer>
                            {userInfo && userInfo.admin && (
                                <LinkContainer to="/new-product/">
                                    <Nav.Link className="nav-link-atelier">+ New</Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>

                        <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
                            <SearchBarForProducts />
                            <CartIcon />
                            {isFrontendOnlyMode && (
                                <span className="preview-badge">Preview</span>
                            )}
                            {userInfo ? (
                                <NavDropdown
                                    title={
                                        <span style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.78rem',
                                            fontWeight: '500',
                                            letterSpacing: '0.1em',
                                            textTransform: 'uppercase'
                                        }}>
                                            {userInfo.username}
                                        </span>
                                    }
                                    id="user-dropdown"
                                    alignRight
                                >
                                    <LinkContainer to="/account">
                                        <NavDropdown.Item>Account</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/all-addresses/">
                                        <NavDropdown.Item>Addresses</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/all-orders/">
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        onClick={logoutHandler}
                                        style={{ color: 'var(--danger)' }}
                                    >
                                        Sign Out
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                                    <LinkContainer to="/login">
                                        <Nav.Link className="nav-link-atelier">Sign In</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/register">
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                padding: '7px 16px',
                                                background: 'var(--gold)',
                                                color: '#0e0d0b',
                                                borderRadius: 'var(--radius)',
                                                fontSize: '0.76rem',
                                                fontWeight: '600',
                                                letterSpacing: '0.08em',
                                                textTransform: 'uppercase',
                                                cursor: 'pointer',
                                                transition: 'background var(--transition)',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-light)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'var(--gold)'}
                                        >
                                            Join
                                        </span>
                                    </LinkContainer>
                                </div>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default NavBar