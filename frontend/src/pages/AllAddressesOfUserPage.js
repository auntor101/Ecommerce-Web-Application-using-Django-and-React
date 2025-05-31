import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Modal, Button, Spinner } from 'react-bootstrap'
import { deleteUserAddress, getAllAddress, checkTokenValidation, logout } from '../actions/userActions'
import { DELETE_USER_ADDRESS_RESET, GET_SINGLE_ADDRESS_RESET } from '../constants'
import { useHistory } from 'react-router-dom'
import CreateAddressComponent from '../components/CreateAddressComponent'

function AllAddressesOfUserPage() {
    let history = useHistory()
    const dispatch = useDispatch()
    const [deleteAddress, setDeleteAddress] = useState("")
    const [createAddress, setCreateAddress] = useState(false)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Selectors
    const checkTokenValidationReducer = useSelector(state => state.checkTokenValidationReducer)
    const { error: tokenError } = checkTokenValidationReducer

    const userLoginReducer = useSelector(state => state.userLoginReducer)
    const { userInfo } = userLoginReducer

    const getAllAddressesOfUserReducer = useSelector(state => state.getAllAddressesOfUserReducer)
    const { addresses, loading: loadingAllAddresses } = getAllAddressesOfUserReducer

    const deleteUserAddressReducer = useSelector(state => state.deleteUserAddressReducer)
    const { success: addressDeletionSuccess } = deleteUserAddressReducer

    useEffect(() => {
        if (!userInfo) {
            history.push("/login")
        } else {
            dispatch(checkTokenValidation())
            dispatch(getAllAddress())
            dispatch({ type: GET_SINGLE_ADDRESS_RESET })
        }
    }, [dispatch, history, userInfo, addressDeletionSuccess])

    if (userInfo && tokenError === "Request failed with status code 401") {
        alert("Session expired, please login again.")
        dispatch(logout())
        history.push("/login")
        window.location.reload()
    }

    if (addressDeletionSuccess) {
        alert("Address successfully deleted.")
        dispatch({ type: DELETE_USER_ADDRESS_RESET })
        dispatch(getAllAddress())
    }

    const deleteAddressHandler = (address) => {
        setDeleteAddress(address)
        handleShow()
    }

    const confirmDelete = (id) => {
        dispatch(deleteUserAddress(id))
        handleClose()
    }

    const toggleCreateAddress = () => {
        setCreateAddress(!createAddress)
    }

    return (
        <div className="fade-in" style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            paddingBottom: '2rem'
        }}>
            {/* Delete Modal */}
            <Modal show={show} onHide={handleClose}>
                <div style={{
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(20px)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    overflow: 'hidden'
                }}>
                    <Modal.Header closeButton style={{
                        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                        color: 'white'
                    }}>
                        <Modal.Title style={{ fontWeight: '700' }}>
                            <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
                            Delete Address
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ padding: '2rem' }}>
                        <p style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748' }}>
                            Delete address: <strong>"{deleteAddress.house_no}, {deleteAddress.city}, {deleteAddress.state}"</strong>?
                        </p>
                    </Modal.Body>
                    <Modal.Footer style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
                        <Button variant="danger" onClick={() => confirmDelete(deleteAddress.id)}
                            style={{
                                background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                fontWeight: '600'
                            }}>
                            Confirm Delete
                        </Button>
                        <Button variant="secondary" onClick={handleClose}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                fontWeight: '600'
                            }}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>

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
                        <i className="fas fa-map-marker-alt" style={{ marginRight: '15px', color: '#667eea' }}></i>
                        Address Manager
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: '0.5rem 0 0' }}>
                        Manage your delivery addresses
                    </p>
                </div>
            </div>

            <div className="container">
                {/* Loading */}
                {loadingAllAddresses && (
                    <div style={{ 
                        display: "flex", 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '3rem',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                        marginBottom: '2rem'
                    }}>
                        <Spinner animation="border" style={{ color: '#667eea', width: '3rem', height: '3rem', marginRight: '1rem' }}/>
                        <h5 style={{ margin: 0, fontWeight: '600', color: '#667eea' }}>Loading Addresses...</h5>
                    </div>
                )}

                {/* Create Address Section */}
                {createAddress ? (
                    <div>
                        <CreateAddressComponent toggleCreateAddress={toggleCreateAddress} />
                    </div>
                ) : (
                    <div style={{ marginBottom: '2rem' }}>
                        <button
                            onClick={toggleCreateAddress}
                            style={{
                                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                padding: '16px 24px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 8px 25px rgba(17, 153, 142, 0.3)',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            className="add-btn"
                        >
                            <i className="fas fa-plus" style={{ marginRight: '10px' }}></i>
                            Add New Address
                        </button>
                    </div>
                )}

                {/* Addresses List */}
                {addresses && !createAddress && (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {addresses.map((address, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                padding: '2rem',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }} className="address-card">
                                <div style={{ paddingRight: '100px' }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        marginBottom: '1rem'
                                    }}>
                                        <i className="fas fa-user" style={{ 
                                            marginRight: '10px', 
                                            color: '#667eea',
                                            fontSize: '1.1rem'
                                        }}></i>
                                        <span style={{ fontWeight: '700', color: '#2d3748', fontSize: '1.1rem' }}>
                                            {address.name}
                                        </span>
                                    </div>
                                    
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        marginBottom: '1rem'
                                    }}>
                                        <i className="fas fa-phone" style={{ 
                                            marginRight: '10px', 
                                            color: '#11998e',
                                            fontSize: '1.1rem'
                                        }}></i>
                                        <span style={{ fontWeight: '600', color: '#4a5568' }}>
                                            +880 {address.phone_number}
                                        </span>
                                    </div>
                                    
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'flex-start'
                                    }}>
                                        <i className="fas fa-map-marker-alt" style={{ 
                                            marginRight: '10px', 
                                            color: '#36d1dc',
                                            fontSize: '1.1rem',
                                            marginTop: '2px'
                                        }}></i>
                                        <span style={{ 
                                            fontWeight: '500', 
                                            color: '#4a5568',
                                            lineHeight: '1.5'
                                        }}>
                                            {address.house_no}, near {address.landmark}, {address.city}, {address.state}, {address.pin_code}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ 
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    display: 'flex',
                                    gap: '0.5rem'
                                }}>
                                    <button
                                        onClick={() => history.push(`/all-addresses/${address.id}/`)}
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                                        }}
                                        className="edit-btn"
                                        title="Edit address"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>

                                    <button
                                        onClick={() => deleteAddressHandler(address)}
                                        style={{
                                            background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            color: 'white',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 15px rgba(255, 65, 108, 0.3)'
                                        }}
                                        className="delete-btn"
                                        title="Delete address"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .add-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(17, 153, 142, 0.5) !important;
                }
                
                .address-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15) !important;
                }
                
                .edit-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5) !important;
                }
                
                .delete-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 8px 25px rgba(255, 65, 108, 0.5) !important;
                }
            `}</style>
        </div>
    )
}

export default AllAddressesOfUserPage