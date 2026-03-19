import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkTokenValidation, getAllOrders, logout } from '../actions/userActions'
import { useHistory } from 'react-router-dom'
import { Table, Spinner } from 'react-bootstrap'
import { dateCheck } from '../components/GetDate'
import { changeDeliveryStatus } from '../actions/productActions'
import { CHANGE_DELIVERY_STATUS_RESET } from '../constants'
import Message from '../components/Message'
import SearchBarForOrdersPage from '../components/SearchBarForOrdersPage'

function OrdersListPage() {
    let history = useHistory()
    const dispatch = useDispatch()
    const placeholderValue = "Search by customer, address or item"
    const todays_date = dateCheck(new Date().toISOString().slice(0, 10))
    const [currentDateInfo] = useState(todays_date)
    const [idOfchangeDeliveryStatus, setIdOfchangeDeliveryStatus] = useState(0)
    const [cloneSearchTerm, setCloneSearchTerm] = useState("")

    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const getAllOrdersReducer = useSelector(state => state.getAllOrdersReducer)
    const { orders, loading: loadingOrders } = getAllOrdersReducer

    const changeDeliveryStatusReducer = useSelector(state => state.changeDeliveryStatusReducer)
    const { success: deliveryStatusChangeSuccess, loading: deliveryStatusChangeSpinner } = changeDeliveryStatusReducer

    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) { history.push("/login") }
        else { dispatch(checkTokenValidation()); dispatch(getAllOrders()) }
    }, [userInfo, dispatch, history])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout()); history.push("/login"); window.location.reload()
    }

    const changeDeliveryStatusHandler = (id, status) => {
        setIdOfchangeDeliveryStatus(id)
        dispatch(changeDeliveryStatus(id, {
            is_delivered: status,
            delivered_at: status ? currentDateInfo : "Not Delivered"
        }))
    }

    if (deliveryStatusChangeSuccess) {
        alert("Delivery status updated")
        dispatch({ type: CHANGE_DELIVERY_STATUS_RESET })
        dispatch(getAllOrders())
    }

    const handleSearchTerm = (term) => setCloneSearchTerm(term)

    const totalOrders = orders.length
    const deliveredOrders = orders.filter(o => o.is_delivered).length
    const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total_price || 0), 0)

    const filtered = orders.filter(o =>
        (o.name || '').toLowerCase().includes(cloneSearchTerm) ||
        (o.ordered_item || '').toLowerCase().includes(cloneSearchTerm) ||
        (o.address || '').toLowerCase().includes(cloneSearchTerm)
    )

    return (
        <div className="page-wrapper fade-in">
            <div className="container" style={{ paddingTop: '2.5rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2.5rem' }}>
                    <div className="section-eyebrow">Admin</div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: 'var(--text-primary)', margin: 0 }}>
                        Orders Dashboard
                    </h1>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                    {[
                        { label: 'Total Orders', value: totalOrders, icon: 'fa-shopping-bag' },
                        { label: 'Delivered', value: deliveredOrders, icon: 'fa-check' },
                        { label: 'Pending', value: totalOrders - deliveredOrders, icon: 'fa-clock' },
                        { label: 'Revenue', value: `\u09f3${Math.round(totalRevenue).toLocaleString()}`, icon: 'fa-taka-sign' },
                    ].map(s => (
                        <div key={s.label} className="content-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                            <i className={`fas ${s.icon}`} style={{ color: 'var(--accent)', fontSize: '1.3rem', marginBottom: '0.5rem', display: 'block' }} />
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.3rem' }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {loadingOrders && (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <Spinner animation="border" style={{ color: 'var(--accent)' }} />
                    </div>
                )}

                {userInfo?.admin && !loadingOrders && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <SearchBarForOrdersPage handleSearchTerm={handleSearchTerm} placeholderValue={placeholderValue} />
                    </div>
                )}

                {!loadingOrders && orders.length === 0 && (
                    <Message variant="info">No orders found.</Message>
                )}

                {!loadingOrders && filtered.length > 0 && (
                    <div className="table-responsive">
                        <Table className="mb-0">
                            <thead>
                                <tr>
                                    <th>#ID</th><th>Customer</th><th>Item</th>
                                    <th>Address</th><th>Amount</th><th>Status</th>
                                    {userInfo?.admin && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((order, idx) => (
                                    <tr key={idx}>
                                        <td style={{ color: 'var(--accent)', fontWeight: 600 }}>#{order.id}</td>
                                        <td>{order.name}</td>
                                        <td>{order.ordered_item}</td>
                                        <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.address}</td>
                                        <td style={{ color: 'var(--success)', fontWeight: 600 }}>&#2547;{parseFloat(order.total_price || 0).toLocaleString()}</td>
                                        <td>
                                            <span className={order.is_delivered ? 'status-delivered' : 'status-pending'}>
                                                {order.is_delivered ? 'Delivered' : 'Pending'}
                                            </span>
                                        </td>
                                        {userInfo?.admin && (
                                            <td>
                                                {deliveryStatusChangeSpinner && idOfchangeDeliveryStatus === order.id ? (
                                                    <Spinner animation="border" size="sm" style={{ color: 'var(--accent)' }} />
                                                ) : order.is_delivered ? (
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => changeDeliveryStatusHandler(order.id, false)}
                                                    >Undeliver</button>
                                                ) : (
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => changeDeliveryStatusHandler(order.id, true)}
                                                    >Deliver</button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrdersListPage
