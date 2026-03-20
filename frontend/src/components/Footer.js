import React from 'react'
import { Link } from 'react-router-dom'

function Footer({ siteSettings }) {
    const year = new Date().getFullYear()

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-grid">
                    <div>
                        <div className="footer-brand">
                            <span className="brand-red">Exclusive</span> BD
                        </div>
                        <p className="footer-desc">
                            Subscribe to get updates on our latest offers and products.
                        </p>
                        <div className="footer-social">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <i className="fab fa-facebook-f" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <i className="fab fa-instagram" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <i className="fab fa-twitter" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <div className="footer-heading">Shop</div>
                        <Link to="/" className="footer-link">All Products</Link>
                        <Link to="/?searchTerm=grocery" className="footer-link">Groceries</Link>
                        <Link to="/?searchTerm=electronics" className="footer-link">Electronics</Link>
                        <Link to="/?searchTerm=fashion" className="footer-link">Fashion</Link>
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
                        <span className="footer-link">{siteSettings?.support_email || 'support@exclusivebd.com'}</span>
                        <span className="footer-link">{siteSettings?.support_phone || '+880 1XXX-XXXXXX'}</span>
                        <span className="footer-link">{siteSettings?.footer_address || 'Dhaka, Bangladesh'}</span>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span className="footer-copy">
                        &copy; {year} Exclusive BD. All rights reserved.
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
