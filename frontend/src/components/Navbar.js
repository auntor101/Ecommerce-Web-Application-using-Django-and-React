import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { useHistory } from "react-router-dom"
import SearchBarForProducts from './SearchBarForProducts'
import CartIcon from './CartIcon'
import { isFrontendOnlyMode } from '../utils/appMode'

function NavBar({ siteSettings }) {
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
            {/* Announcement Bar */}
            <div className="announcement-bar">
                <span>Summer Sale — Up to 50% off! Free delivery on orders over ৳1,000. <strong>Shop Now →</strong></span>
            </div>

            <Navbar expand="lg" collapseOnSelect>
                <Container fluid className="navbar-shell">
                    <LinkContainer to="/">
                        <Navbar.Brand>
                            <span className="brand-accent">Exclusive</span>BD
                        </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="main-nav" />

                    <Navbar.Collapse id="main-nav">
                        <Nav className="mr-auto align-items-lg-center">
                            <LinkContainer to="/">
                                <Nav.Link className="nav-link-atelier">Home</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/?searchTerm=grocery">
                                <Nav.Link className="nav-link-atelier">Groceries</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/?searchTerm=electronics">
                                <Nav.Link className="nav-link-atelier">Electronics</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/contact">
                                <Nav.Link className="nav-link-atelier">Contact</Nav.Link>
                            </LinkContainer>
                            {userInfo && userInfo.admin && (
                                <LinkContainer to="/new-product/">
                                    <Nav.Link className="nav-link-atelier">+ New</Nav.Link>
                                </LinkContainer>
                            )}
                        </Nav>

                        <div className="nav-utility">
                            <SearchBarForProducts />
                            <CartIcon />
                            {isFrontendOnlyMode && (
                                <span className="preview-badge">Preview</span>
                            )}
                            {userInfo ? (
                                <NavDropdown
                                    title={
                                        <span className="nav-user-chip">
                                            <i className="fas fa-user-circle" style={{ marginRight: 5 }} />
                                            {userInfo.username}
                                        </span>
                                    }
                                    id="user-dropdown"
                                    alignRight
                                >
                                    <LinkContainer to="/account">
                                        <NavDropdown.Item>
                                            <i className="fas fa-user me-2" />Account
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/all-addresses/">
                                        <NavDropdown.Item>
                                            <i className="fas fa-map-marker-alt me-2" />Addresses
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/all-orders/">
                                        <NavDropdown.Item>
                                            <i className="fas fa-box me-2" />Orders
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    {userInfo.admin && (
                                        <LinkContainer to="/admin/site-settings/">
                                            <NavDropdown.Item>
                                                <i className="fas fa-sliders-h me-2" />Site Settings
                                            </NavDropdown.Item>
                                        </LinkContainer>
                                    )}
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={logoutHandler} className="nav-logout-item">
                                        <i className="fas fa-sign-out-alt me-2" />Sign Out
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <div className="nav-auth-actions">
                                    <LinkContainer to="/login">
                                        <Nav.Link className="nav-link-atelier">Sign In</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/register">
                                        <span className="join-btn">Join</span>
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