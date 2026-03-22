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
    <div className="page-wrapper fade-in checkout-page">
      <div className="container page-pad-y">
        <div className="page-hero compact checkout-page-hero">
          <div className="page-hero-eyebrow">Checkout</div>
          <h1 className="page-hero-title">Secure Payment</h1>
        </div>

        {error && <Message variant='danger'>{error}</Message>}
        {paymentError && <Alert variant="danger">{paymentError}</Alert>}

        {loading && (
          <div className="page-loading">
            <Spinner animation="border" className="page-loading-spinner" />
          </div>
        )}

        {!loading && product && (
          <Row>
            <Col lg={7} className="mb-4">
              <div className="content-card checkout-block">
                <div className="content-card-header">
                  <h4 className="checkout-block-title">
                    Shipping Address
                  </h4>
                </div>
                <UserAddressComponent handleAddressId={handleAddressId} />
              </div>
            </Col>

            <Col lg={5}>
              <div className="content-card checkout-block checkout-payment-card">
                <div className="content-card-header">
                  <h4 className="checkout-block-title">
                    Payment
                  </h4>
                </div>

                <Form onSubmit={handlePayment}>
                  <Form.Label className="checkout-label">Payment Method</Form.Label>
                  {paymentMethods.map(method => (
                    <div
                      key={method.value}
                      className={`payment-option ${paymentMethod === method.value ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      <i className={`fas fa-${method.icon} checkout-payment-icon`} />
                      <span className="checkout-payment-name">{method.label}</span>
                    </div>
                  ))}

                  <div className="checkout-confirm-wrap">
                    <Form.Check
                      type="checkbox"
                      label="Confirm & authorise payment"
                      checked={paidStatus}
                      onChange={e => setPaidStatus(e.target.checked)}
                      className="checkout-confirm-check"
                    />
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!addressSelected || paidStatus}
                    className="checkout-submit"
                  >
                  {paidStatus ? '\u2713 Payment Complete' : `Pay \u09f3${Number(product.price).toLocaleString()}`}
                  </Button>
                </Form>

                {showPaidAlert && (
                  <Alert variant="success" className="checkout-status-alert">
                    {paymentMessage || "Payment processed successfully!"}
                  </Alert>
                )}
                {addressSelected && (
                  <p className="checkout-address-ok">
                    ✓ Delivery address confirmed
                  </p>
                )}
              </div>

              <div className="content-card checkout-block checkout-summary-card">
                <div className="content-card-header">
                  <h5 className="checkout-block-title small">
                    Order Summary
                  </h5>
                </div>
                <div className="checkout-order-item">
                  <img
                    src={product.image || fallbackImg}
                    onError={e => { e.target.src = fallbackImg }}
                    alt={product.name}
                    className="checkout-order-thumb"
                  />
                  <div className="checkout-order-meta">
                    <div className="checkout-order-name">{product.name}</div>
                    <div className="checkout-order-qty">Qty: 1</div>
                  </div>
                  <span className="checkout-order-price">&#2547;{Number(product.price).toLocaleString()}</span>
                </div>
                <div className="checkout-summary-total">
                  <span>Total</span>
                  <span>
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
