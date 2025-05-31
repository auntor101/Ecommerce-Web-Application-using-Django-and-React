import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkTokenValidation, getAllOrders, logout } from '../actions/userActions'
import { useHistory } from 'react-router-dom'
import { Table, Spinner } from 'react-bootstrap'
import { dateCheck } from '../components/GetDate'
import { changeDeliveryStatus } from '../actions/productActions'
import { CHANGE_DELIVERY_STATUS_RESET } from '../constants'
import SearchBarForOrdersPage from '../components/SearchBarForOrdersPage'
import Message from '../components/Message'

function OrdersListPage() {
    let history = useHistory()
    const dispatch = useDispatch()
    const placeholderValue = "Search orders by Customer Name, Address or by Ordered Item"

    const todays_date = dateCheck(new Date().toISOString().slice(0, 10))

    const [currentDateInfo] = useState(todays_date)
    const [idOfchangeDeliveryStatus, setIdOfchangeDeliveryStatus] = useState(0)
    const [cloneSearchTerm, setCloneSearchTerm] = useState("")

    // login reducer
    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    // get all orders reducer
    const getAllOrdersReducer = useSelector(state => state.getAllOrdersReducer)
    const { orders, loading: loadingOrders } = getAllOrdersReducer

    // change delivery status reducer
    const changeDeliveryStatusReducer = useSelector(state => state.changeDeliveryStatusReducer)
    const { success: deliveryStatusChangeSuccess, loading: deliveryStatusChangeSpinner } = changeDeliveryStatusReducer

    // check token validation reducer
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getAllOrders())
        }
    }, [userInfo, dispatch, history])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    const changeDeliveryStatusHandler = (id, status) => {
        setIdOfchangeDeliveryStatus(id)
        const productData = {
            "is_delivered": status,
            "delivered_at": status ? currentDateInfo : "Not Delivered"
        }
        dispatch(changeDeliveryStatus(id, productData))
    }

    if (deliveryStatusChangeSuccess) {
        alert("Delivery status changed successfully")
        dispatch({
            type: CHANGE_DELIVERY_STATUS_RESET
        })
        dispatch(getAllOrders())
    }

    const handleSearchTerm = (term) => {
        setCloneSearchTerm(term)
    };

    // Calculate statistics
    const totalOrders = orders.length
    const deliveredOrders = orders.filter(order => order.is_delivered).length
    const pendingOrders = totalOrders - deliveredOrders
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0)

    return (
        <div className="fade-in" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', paddingBottom: '2rem' }}>
            {/* Admin Dashboard Header */}
            <div 
                style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '0 0 24px 24px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h1 style={{
                            margin: 0,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            fontSize: '2.5rem',
                            fontWeight: '700'
                        }}>
                            <i className="fas fa-chart-line" style={{ marginRight: '15px', color: '#667eea' }}></i>
                            Admin Dashboard
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: '0.5rem 0 0' }}>
                            Monitor and manage your orders efficiently
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            color: 'white',
                            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                            transition: 'transform 0.3s ease'
                        }} className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem', fontWeight: '500' }}>Total Orders</p>
                                    <h3 style={{ margin: '0.5rem 0 0', fontSize: '2rem', fontWeight: '700' }}>{totalOrders}</h3>
                                </div>
                                <i className="fas fa-shopping-cart" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            color: 'white',
                            boxShadow: '0 10px 30px rgba(17, 153, 142, 0.3)',
                            transition: 'transform 0.3s ease'
                        }} className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem', fontWeight: '500' }}>Delivered</p>
                                    <h3 style={{ margin: '0.5rem 0 0', fontSize: '2rem', fontWeight: '700' }}>{deliveredOrders}</h3>
                                </div>
                                <i className="fas fa-check-circle" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            color: 'white',
                            boxShadow: '0 10px 30px rgba(255, 65, 108, 0.3)',
                            transition: 'transform 0.3s ease'
                        }} className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem', fontWeight: '500' }}>Pending</p>
                                    <h3 style={{ margin: '0.5rem 0 0', fontSize: '2rem', fontWeight: '700' }}>{pendingOrders}</h3>
                                </div>
                                <i className="fas fa-clock" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
                            </div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #36d1dc 0%, #5b86e5 100%)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            color: 'white',
                            boxShadow: '0 10px 30px rgba(54, 209, 220, 0.3)',
                            transition: 'transform 0.3s ease'
                        }} className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem', fontWeight: '500' }}>Revenue</p>
                                    <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.8rem', fontWeight: '700' }}>৳{totalRevenue.toLocaleString()}</h3>
                                </div>
                                <i className="fas fa-chart-pie" style={{ fontSize: '2.5rem', opacity: 0.8 }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Loading State */}
                {loadingOrders && (
                    <div style={{ 
                        display: "flex", 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '3rem',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Spinner 
                            animation="border" 
                            style={{ 
                                color: '#667eea',
                                width: '3rem',
                                height: '3rem',
                                marginRight: '1rem'
                            }}
                        />
                        <h5 style={{ margin: 0, fontWeight: '600', color: '#667eea' }}>Loading Orders...</h5>
                    </div>
                )}

                {/* Search Bar */}
                {userInfo?.admin && !loadingOrders && (
                    <div style={{ marginBottom: '2rem' }}>
                        <SearchBarForOrdersPage handleSearchTerm={handleSearchTerm} placeholderValue={placeholderValue} />
                    </div>
                )}

                {/* Orders Table */}
                {!loadingOrders && orders.length > 0 ? (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div style={{ overflowX: 'auto' }}>
                            <Table className="mb-0" style={{ background: 'transparent' }}>
                                <thead>
                                    <tr style={{ 
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white'
                                    }}>
                                        <th style={{ padding: '1.25rem', fontWeight: '600', border: 'none' }}>
                                            <i className="fas fa-hashtag" style={{ marginRight: '8px' }}></i>
                                            Order ID
                                        </th>
                                        <th style={{ padding: '1.25rem', fontWeight: '600', border: 'none' }}>
                                            <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                                            Customer
                                        </th>
                                        <th style={{ padding: '1.25rem', fontWeight: '600', border: 'none' }}>
                                            <i className="fas fa-credit-card" style={{ marginRight: '8px' }}></i>
                                            Card Used
                                        </th>
                                        <th style={{ padding: '1.25rem', fontWeight: '600', border: 'none' }}>
                                            <i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>
                                            Address
                                        </th>
                                        <th style={{ padding: '1.25rem', fontWeight: '600', border: 'none' }}>
                                            <i className="fas fa-box" style={{ marginRight: '8px' }}></i>
                                            Item
                                        </th>
                                        <th style={{ padding: '1.25rem', fontWeight: '600', border: 'none' }}>
                                            <i className="fas fa-money-bill" style={{ marginRight: '8px' }}></i>
                                            Amount
                                        </th>
                                        <th style={{ padding: '1.25rem', fontWeight: '600', border: 'none' }}>
                                            <i className="fas fa-truck" style={{ marginRight: '8px' }}></i>
                                            Status
                                        </th>
                                        {userInfo?.admin && (
                                            <th style={{ padding: '1.25rem', fontWeight: '600', border: 'none' }}>
                                                <i className="fas fa-cogs" style={{ marginRight: '8px' }}></i>
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.filter((item) => (
                                        item.name.toLowerCase().includes(cloneSearchTerm) ||
                                        item.ordered_item.toLowerCase().includes(cloneSearchTerm) ||
                                        item.address.toLowerCase().includes(cloneSearchTerm)
                                    )).map((order, idx) => (
                                        <tr key={idx} style={{ 
                                            transition: 'all 0.3s ease',
                                            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                                        }} className="order-row">
                                            <td style={{ padding: '1.25rem', fontWeight: '600', color: '#667eea' }}>
                                                #{order.id}
                                            </td>
                                            <td style={{ padding: '1.25rem', fontWeight: '500' }}>
                                                {order.name}
                                            </td>
                                            <td style={{ padding: '1.25rem', color: '#6b7280' }}>
                                                {order.card_number}
                                            </td>
                                            <td style={{ padding: '1.25rem', color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {order.address}
                                            </td>
                                            <td style={{ padding: '1.25rem', fontWeight: '500' }}>
                                                {order.ordered_item}
                                            </td>
                                            <td style={{ padding: '1.25rem', fontWeight: '700', color: '#11998e' }}>
                                                ৳{order.total_price}
                                            </td>
                                            <td style={{ padding: '1.25rem' }}>
                                                {order.is_delivered ? (
                                                    <span style={{
                                                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                                        color: 'white',
                                                        padding: '6px 12px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600',
                                                        display: 'inline-flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        <i className="fas fa-check-circle" style={{ marginRight: '6px' }}></i>
                                                        Delivered
                                                    </span>
                                                ) : (
                                                    <span style={{
                                                        background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                                                        color: 'white',
                                                        padding: '6px 12px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '600',
                                                        display: 'inline-flex',
                                                        alignItems: 'center'
                                                    }}>
                                                        <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            {userInfo?.admin && (
                                                <td style={{ padding: '1.25rem' }}>
                                                    {order.is_delivered ? (
                                                        <button
                                                            className="btn btn-sm"
                                                            style={{
                                                                background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                color: 'white',
                                                                padding: '8px 16px',
                                                                fontWeight: '600',
                                                                fontSize: '0.85rem',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onClick={() => changeDeliveryStatusHandler(order.id, false)}
                                                        >
                                                            {deliveryStatusChangeSpinner && idOfchangeDeliveryStatus === order.id ? (
                                                                <Spinner animation="border" size="sm" />
                                                            ) : (
                                                                <>
                                                                    <i className="fas fa-times" style={{ marginRight: '6px' }}></i>
                                                                    Mark Undelivered
                                                                </>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm"
                                                            style={{
                                                                background: 'linear-gradient(135d45deg, #11998e 0%, #38ef7d 100%)',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                color: 'white',
                                                                padding: '8px 16px',
                                                                fontWeight: '600',
                                                                fontSize: '0.85rem',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onClick={() => changeDeliveryStatusHandler(order.id, true)}
                                                        >
                                                            {deliveryStatusChangeSpinner && idOfchangeDeliveryStatus === order.id ? (
                                                                <Spinner animation="border" size="sm" />
                                                            ) : (
                                                                <>
                                                                    <i className="fas fa-check" style={{ marginRight: '6px' }}></i>
                                                                    Mark Delivered
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                ) : !loadingOrders && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '3rem',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Message variant="info">
                            <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#36d1dc', marginBottom: '1rem', display: 'block' }}></i>
                            No orders yet.
                        </Message>
                    </div>
                )}
            </div>

            <style jsx>{`
                .stat-card:hover {
                    transform: translateY(-8px);
                }
                
                .order-row:hover {
                    background: rgba(102, 126, 234, 0.03);
                    transform: scale(1.01);
                }
                
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </div>
    )
}

export default OrdersListPage