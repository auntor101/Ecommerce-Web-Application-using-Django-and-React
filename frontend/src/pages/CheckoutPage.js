import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Row, Col, Button, Form, Alert } from 'react-bootstrap'
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
  { label: 'Cash on Delivery', value: 'cash', icon: 'money-bill-wave' },
]

const CheckoutPage = ({ match }) => {
  let history = useHistory()
  const dispatch = useDispatch()
  const [addressSelected, setAddressSelected] = useState(false)
  const [, setSelectedAddressId] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('bkash')
  const [paidStatus, setPaidStatus] = useState(false)
  const [showPaidAlert, setShowPaidAlert] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState("")
  const [paymentError, setPaymentError] = useState("")

  const handleAddressId = (id) => {
    if (id) setAddressSelected(true)
    setSelectedAddressId(id)
  }

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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` },
      }
      const { data } = await axios.post('/payments/process/', {
        payment_method: paymentMethod,
        order_id: product.id,
        amount: product.price,
        paid_status: true,
      }, config)
      setPaidStatus(true)
      setShowPaidAlert(true)
      setPaymentMessage(data.message)
      setTimeout(() => setShowPaidAlert(false), 3000)
    } catch (err) {
      setPaymentError(err.response?.data?.detail || 'Payment failed. Please try again.')
    }
  }

  const fallbackImg = product
    ? `https://picsum.photos/seed/${encodeURIComponent(product.name || product.id)}/80/80`
    : 'https://picsum.photos/seed/checkout/80/80'

  return (
    <div className="page-wrapper fade-in">
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Page header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div className="section-eyebrow">Checkout</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--text-primary)', margin: 0 }}>
            Secure Payment
          </h1>
        </div>

        {error && <Message variant='danger'>{error}</Message>}
        {paymentError && <Alert variant="danger">{paymentError}</Alert>}

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <Spinner animation="border" style={{ color: 'var(--accent)' }} />
          </div>
        )}

        {!loading && product && (
          <Row>
            {/* Shipping */}
            <Col lg={7} className="mb-4">
              <div className="content-card">
                <div className="content-card-header">
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    Shipping Address
                  </h4>
                </div>
                <UserAddressComponent handleAddressId={handleAddressId} />
              </div>
            </Col>

            {/* Payment */}
            <Col lg={5}>
              <div className="content-card" style={{ marginBottom: '1.5rem' }}>
                <div className="content-card-header">
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    Payment
                  </h4>
                </div>

                <Form onSubmit={handlePayment}>
                  <Form.Label style={{ marginBottom: '0.75rem' }}>Payment Method</Form.Label>
                  {paymentMethods.map(method => (
                    <div
                      key={method.value}
                      className={`payment-option ${paymentMethod === method.value ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <i className={`fas fa-${method.icon}`} style={{ color: 'var(--accent)', width: '18px' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>{method.label}</span>
                    </div>
                  ))}

                  <div style={{ margin: '1.5rem 0' }}>
                    <Form.Check
                      type="checkbox"
                      label="Confirm & authorise payment"
                      checked={paidStatus}
                      onChange={e => setPaidStatus(e.target.checked)}
                      style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}
                    />
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!addressSelected || paidStatus}
                    style={{ width: '100%', padding: '0.75rem' }}
                  >
                  {paidStatus ? '\u2713 Payment Complete' : `Pay \u09f3${Number(product.price).toLocaleString()}`}
                  </Button>
                </Form>

                {showPaidAlert && (
                  <Alert variant="success" style={{ marginTop: '1rem' }}>
                    {paymentMessage || "Payment processed successfully!"}
                  </Alert>
                )}
                {addressSelected && (
                  <p style={{ color: 'var(--success)', fontSize: '0.82rem', marginTop: '0.75rem', marginBottom: 0 }}>
                    âœ“ Delivery address confirmed
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="content-card">
                <div className="content-card-header">
                  <h5 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    Order Summary
                  </h5>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <img
                    src={product.image || fallbackImg}
                    onError={e => { e.target.src = fallbackImg }}
                    alt={product.name}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 'var(--radius)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{product.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Qty: 1</div>
                  </div>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>&#2547;{Number(product.price).toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Total</span>
                  <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
                    &#2547;{Number(product.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage
