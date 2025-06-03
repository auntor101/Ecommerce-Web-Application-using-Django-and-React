import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { useHistory } from "react-router-dom";
import SearchBarForProducts from './SearchBarForProducts'
// Import CartIcon
import CartIcon from './CartIcon'

function NavBar() {
    let history = useHistory()
    const dispatch = useDispatch()

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // logout
    const logoutHandler = () => {
        dispatch(logout()) // action
        history.push("/login")
        window.location.reload()
    }

    return (
        <header className="slide-in">
            <Navbar 
                bg="dark" 
                variant="dark" 
                expand="lg" 
                collapseOnSelect
                className="shadow-lg"
                style={{
                    background: 'rgba(45, 55, 72, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand 
                            style={{ 
                                fontWeight: '700',
                                fontSize: '1.8rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                        >
                            <i className="mb-2 fas fa-home" style={{ marginRight: '10px' }}></i>
                            Auntor Shopping Mall
                        </Navbar.Brand>
                    </LinkContainer>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {/* All Products */}
                            <LinkContainer to="/">
                                <Nav.Link 
                                    style={{ 
                                        fontWeight: '500',
                                        transition: 'all 0.3s ease',
                                        position: 'relative'
                                    }}
                                    className="nav-link-modern"
                                >
                                    All Products
                                </Nav.Link>
                            </LinkContainer>

                            {/* New Product (Admins Only) */}
                            {userInfo && userInfo.admin && (
                                <LinkContainer to="/new-product/">
                                    <Nav.Link 
                                        style={{ 
                                            fontWeight: '500',
                                            transition: 'all 0.3s ease'
                                        }}
                                        className="nav-link-modern"
                                    >
                                        <i className="fas fa-plus" style={{ marginRight: '5px' }}></i>
                                        Add Product
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            <div className="d-flex align-items-center ml-3">
                                <SearchBarForProducts />
                            </div>
                        </Nav>

                        {/* User Actions */}
                        <div className="d-flex align-items-center gap-3">
                            {/* Cart Icon */}
                            <CartIcon />

                            {/* login-logout condition here */}
                            {userInfo ? (
                                <div>
                                    <NavDropdown 
                                        className="navbar-nav text-capitalize" 
                                        title={
                                            <span style={{ 
                                                fontWeight: '600',
                                                color: '#e2e8f0'
                                            }}>
                                                <i className="fas fa-user-circle" style={{ marginRight: '8px' }}></i>
                                                {userInfo.username}
                                            </span>
                                        } 
                                        id='username'
                                        style={{
                                            borderRadius: '12px'
                                        }}
                                    >
                                        <LinkContainer to="/account">
                                            <NavDropdown.Item 
                                                style={{ 
                                                    padding: '12px 20px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <i className="fas fa-user" style={{ marginRight: '10px', color: '#667eea' }}></i>
                                                Account Settings
                                            </NavDropdown.Item>
                                        </LinkContainer>
                                        
                                        <LinkContainer to="/all-addresses/">
                                            <NavDropdown.Item 
                                                style={{ 
                                                    padding: '12px 20px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <i className="fas fa-map-marker-alt" style={{ marginRight: '10px', color: '#11998e' }}></i>
                                                Address Settings
                                            </NavDropdown.Item>
                                        </LinkContainer>
                                        
                                        <LinkContainer to="/all-orders/">
                                            <NavDropdown.Item 
                                                style={{ 
                                                    padding: '12px 20px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <i className="fas fa-shopping-bag" style={{ marginRight: '10px', color: '#764ba2' }}></i>
                                                All Orders
                                            </NavDropdown.Item>
                                        </LinkContainer>
                                        
                                        <NavDropdown.Divider />
                                        
                                        <NavDropdown.Item 
                                            onClick={logoutHandler}
                                            style={{ 
                                                padding: '12px 20px',
                                                fontWeight: '500',
                                                transition: 'all 0.3s ease',
                                                color: '#ff416c'
                                            }}
                                        >
                                            <i className="fas fa-sign-out-alt" style={{ marginRight: '10px' }}></i>
                                            Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </div>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link 
                                        style={{ 
                                            fontWeight: '500',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '8px',
                                            padding: '8px 16px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        className="login-btn"
                                    >
                                        <i className="fas fa-user"></i> Login
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <style jsx>{`
                .nav-link-modern:hover {
                    color: #667eea !important;
                    transform: translateY(-2px);
                }
                
                .nav-link-modern::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 2px;
                    bottom: 0;
                    left: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    transition: all 0.3s ease;
                    transform: translateX(-50%);
                }
                
                .nav-link-modern:hover::after {
                    width: 100%;
                }
                
                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                }
                
                .dropdown-menu {
                    border-radius: 12px;
                    border: none;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    backdrop-filter: blur(20px);
                    background: rgba(255, 255, 255, 0.95);
                }
                
                .dropdown-item:hover {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                    color: #667eea;
                    transform: translateX(5px);
                }
            `}</style>
        </header>
    )
}

export default NavBar