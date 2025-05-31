import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Container, Card, Button, Form, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'
import UserAddressComponent from '../components/UserAddressComponent'
import { checkTokenValidation, logout } from '../actions/userActions'
import axios from 'axios'

const paymentMethods = [
  { label: 'bKash', value: 'bkash', icon: 'mobile-alt' },
  { label: 'Visa', value: 'visa', icon: 'credit-card' },
  { label: 'MasterCard', value: 'mastercard', icon: 'credit-card' },
]

const CheckoutPage = ({ match }) => {
  let history = useHistory()
  const dispatch = useDispatch()
  const [addressSelected, setAddressSelected] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('bkash')
  const [paidStatus, setPaidStatus] = useState(false)
  const [showPaidAlert, setShowPaidAlert] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState("")
  const [paymentError, setPaymentError] = useState("")

  const handleAddressId = (id) => {
    if (id) {
      setAddressSelected(true)
    }
    setSelectedAddressId(id)
  }

  // Selectors
  const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
  const { error: tokenError } = checkTokenValidationReducer

  const productDetailsReducer = useSelector(state => state.productDetailsReducer)
  const { loading, error, product } = productDetailsReducer

  const userLoginReducer = useSelector(state => state.userLoginReducer)
  const { userInfo } = userLoginReducer

  useEffect(() => {
    if (!userInfo) {
      history.push("/login")
    } else {
      dispatch(checkTokenValidation())
      dispatch(getProductDetails(match.params.id))
    }
  }, [dispatch, match, history, userInfo])

  if (userInfo && tokenError === "Request failed with status code 401") {
    alert("Session expired, please login again.")
    dispatch(logout())
    history.push("/login")
    window.location.reload()
  }

  const handlePayment = async (e) => {
    e.preventDefault()
    setPaymentError("")
    setPaymentMessage("")
    if (!product) return
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.post(
        '/payments/mock-payment/',
        {
          payment_method: paymentMethod,
          order_id: product.id,
          amount: product.price,
          paid_status: true,
        },
        config
      )
      setPaidStatus(true)
      setShowPaidAlert(true)
      setPaymentMessage(data.message)
      setTimeout(() => setShowPaidAlert(false), 3000)
    } catch (err) {
      setPaymentError(err.response?.data?.detail || 'Payment failed. Please try again.')
    }
  }

  return (
    <div className="fade-in" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingBottom: '2rem'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '0 0 24px 24px',
        padding: '2rem 0',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div className="container text-center">
          <h1 style={{
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>
            <i className="fas fa-shopping-cart" style={{ marginRight: '15px', color: '#667eea' }}></i>
            Secure Checkout
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: '0.5rem 0 0' }}>
            Complete your purchase safely and securely
          </p>
        </div>
      </div>

      <div className="container">
        {error && <div style={{ marginBottom: '2rem' }}><Message variant='danger'>{error}</Message></div>}
        {paymentError && <Alert variant="danger">{paymentError}</Alert>}
        
        {loading && (
          <div style={{ 
            display: "flex", 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '4rem',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
          }}>
            <Spinner animation="border" style={{ color: '#667eea', width: '3rem', height: '3rem', marginRight: '1rem' }}/>
            <h5 style={{ margin: 0, fontWeight: '600', color: '#667eea' }}>Loading Checkout...</h5>
          </div>
        )}

        {!loading && product && (
          <Row>
            {/* Shipping Address */}
            <Col lg={7} className="mb-4">
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{ 
                  marginBottom: '1.5rem',
                  color: '#2d3748',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="fas fa-map-marker-alt" style={{ marginRight: '12px', color: '#667eea' }}></i>
                  Shipping Address
                </h3>
                <UserAddressComponent handleAddressId={handleAddressId} />
              </div>
            </Col>

            {/* Payment Section */}
            <Col lg={5}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  marginBottom: '1.5rem',
                  color: '#2d3748',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="fas fa-credit-card" style={{ marginRight: '12px', color: '#11998e' }}></i>
                  Payment Details
                </h3>

                <Form onSubmit={handlePayment}>
                  <Form.Group controlId="paymentMethod" style={{ marginBottom: '1.5rem' }}>
                    <Form.Label style={{ fontWeight: '600', color: '#2d3748', marginBottom: '1rem' }}>
                      Payment Method
                    </Form.Label>
                    {paymentMethods.map(method => (
                      <div key={method.value} style={{
                        border: paymentMethod === method.value ? '2px solid #11998e' : '2px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: paymentMethod === method.value ? 'rgba(17, 153, 142, 0.05)' : 'white'
                      }} onClick={() => setPaymentMethod(method.value)}>
                        <Form.Check
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={() => setPaymentMethod(method.value)}
                          label={
                            <span style={{ display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                              <i className={`fas fa-${method.icon}`} style={{ marginRight: '10px', color: '#11998e' }}></i>
                              {method.label}
                            </span>
                          }
                          style={{ margin: 0 }}
                        />
                      </div>
                    ))}
                  </Form.Group>

                  <Form.Group controlId="paidStatus" style={{ marginBottom: '2rem' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '12px',
                      padding: '1rem'
                    }}>
                      <Form.Check
                        type="checkbox"
                        label="Mark as Paid (for testing)"
                        checked={paidStatus}
                        onChange={e => setPaidStatus(e.target.checked)}
                        style={{ fontWeight: '600', color: '#667eea' }}
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={!addressSelected || paidStatus}
                    style={{
                      width: '100%',
                      background: paidStatus ? 
                        'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                      opacity: !addressSelected && !paidStatus ? 0.6 : 1,
                      cursor: !addressSelected && !paidStatus ? 'not-allowed' : 'pointer'
                    }}
                    className="payment-btn"
                  >
                    <i className={`fas fa-${paidStatus ? 'check-circle' : 'credit-card'}`} style={{ marginRight: '10px' }}></i>
                    {paidStatus ? 'Payment Complete' : `Pay ৳${product.price}`}
                  </Button>
                </Form>

                {showPaidAlert && (
                  <Alert variant="success" style={{ marginTop: '1rem', borderRadius: '12px' }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                    {paymentMessage || "Payment processed successfully!"}
                  </Alert>
                )}

                {addressSelected && (
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.05) 0%, rgba(56, 239, 125, 0.05) 100%)',
                    border: '1px solid rgba(17, 153, 142, 0.2)',
                    borderRadius: '12px'
                  }}>
                    <span style={{ color: '#11998e', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                      <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                      Delivery address confirmed
                    </span>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h4 style={{ marginBottom: '1.5rem', fontWeight: '700', color: '#2d3748' }}>
                  <i className="fas fa-receipt" style={{ marginRight: '10px', color: '#36d1dc' }}></i>
                  Order Summary
                </h4>
                
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <img src={product.image} alt={product.name} style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '8px', 
                    objectFit: 'cover',
                    marginRight: '1rem'
                  }}/>
                  <div style={{ flex: 1 }}>
                    <h6 style={{ margin: 0, fontWeight: '600', color: '#2d3748' }}>{product.name}</h6>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>Qty: 1</p>
                  </div>
                  <span style={{ fontWeight: '700', color: '#667eea', fontSize: '1.2rem' }}>৳{product.price}</span>
                </div>
                
                <hr style={{ margin: '1.5rem 0', border: 'none', height: '1px', background: 'rgba(0,0,0,0.1)' }}/>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#2d3748' }}>Total:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#667eea' }}>৳{product.price}</span>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </div>

      <style jsx>{`
        .payment-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.6) !important;
        }
      `}</style>
    </div>
  )
}

export default CheckoutPage