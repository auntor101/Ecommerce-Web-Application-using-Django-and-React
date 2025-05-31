import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Row, Col, Container, Image, Card, Button, Form, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getProductDetails } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'
import UserAddressComponent from '../components/UserAddressComponent'
import { checkTokenValidation, logout } from '../actions/userActions'
import axios from 'axios'

const paymentMethods = [
  { label: 'bKash', value: 'bkash' },
  { label: 'Visa', value: 'visa' },
  { label: 'MasterCard', value: 'mastercard' },
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

  // set address id handler
  const handleAddressId = (id) => {
    if (id) {
      setAddressSelected(true)
    }
    setSelectedAddressId(id)
  }

  // check token validation reducer
  const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
  const { error: tokenError } = checkTokenValidationReducer

  // product details reducer
  const productDetailsReducer = useSelector(state => state.productDetailsReducer)
  const { loading, error, product } = productDetailsReducer

  // login reducer
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
          order_id: product.id, // using product id as order id for mock
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
    <div className="fade-in">
      {error ? <Message variant='danger'>{error}</Message> : ""}
      {paymentError && <Alert variant="danger">{paymentError}</Alert>}
      {loading &&
        <span style={{ display: "flex" }}>
          <h5>Getting Checkout Info</h5>
          <span className="ml-2">
            <Spinner animation="border" />
          </span>
        </span>}
      {!loading && product && (
        <Container>
          <Row>
            <Col xs={6}>
              <h3>Shipping Address</h3>
              <UserAddressComponent handleAddressId={handleAddressId} />
            </Col>
            <Col xs={6}>
              <h3>Payments Section</h3>
              <Form onSubmit={handlePayment}>
                <Form.Group controlId="paymentMethod">
                  <Form.Label>Select Payment Method</Form.Label>
                  <Form.Control
                    as="select"
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                  >
                    {paymentMethods.map(method => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="paidStatus" className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="Mark as Paid"
                    checked={paidStatus}
                    onChange={e => setPaidStatus(e.target.checked)}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant={paidStatus ? "success" : "primary"}
                  className="mt-3"
                  disabled={!addressSelected || paidStatus}
                >
                  {paidStatus ? "Paid" : "Pay Now"}
                </Button>
              </Form>
              {showPaidAlert && <Alert variant="success" className="mt-3">{paymentMessage || "Payment status updated!"}</Alert>}
              <Card className="p-2 mt-2 mb-2" style={{ border: "1px solid", borderColor: "#C6ACE7" }}>
                {addressSelected ? (
                  <div>
                    <span className="text-info">
                      <b><em>Will be delivered at the selected address</em></b>
                    </span>
                  </div>
                ) : ""}
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  )
}

export default CheckoutPage