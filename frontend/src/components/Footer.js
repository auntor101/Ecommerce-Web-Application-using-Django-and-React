import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand">
                            <i className="fas fa-leaf" style={{ marginRight: 6 }} />
                            Auntor
                        </div>
                        <p className="footer-desc">
                            Fresh groceries, household essentials, and quality products delivered
                            across Bangladesh. Shop with confidence.
                        </p>
                    </div>

                    <div>
                        <div className="footer-heading">Shop</div>
                        <Link to="/" className="footer-link">All Products</Link>
                        <Link to="/?searchTerm=grocery" className="footer-link">Groceries</Link>
                        <Link to="/?searchTerm=electronics" className="footer-link">Electronics</Link>
                        <Link to="/?searchTerm=home" className="footer-link">Home &amp; Living</Link>
                    </div>

                    <div>
                        <div className="footer-heading">Account</div>
                        <Link to="/login" className="footer-link">Sign In</Link>
                        <Link to="/register" className="footer-link">Create Account</Link>
                        <Link to="/all-orders/" className="footer-link">My Orders</Link>
                        <Link to="/all-addresses/" className="footer-link">Addresses</Link>
                    </div>

                    <div>
                        <div className="footer-heading">Support</div>
                        <span className="footer-link">help@auntor.com.bd</span>
                        <span className="footer-link">+880 1XXX-XXXXXX</span>
                        <span className="footer-link">Dhaka, Bangladesh</span>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span className="footer-copy">
                        &copy; {year} Auntor Shopping Mall. All rights reserved.
                    </span>
                    <div className="footer-locale">
                        <i className="fas fa-globe" />
                        <span>Bangladesh (BDT &#2547;)</span>
                        <span style={{ margin: '0 0.4rem' }}>|</span>
                        <span>English</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
