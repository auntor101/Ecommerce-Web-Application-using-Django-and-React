export const ADD_TO_CART = 'ADD_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
export const UPDATE_CART_QUANTITY = 'UPDATE_CART_QUANTITY'
export const CLEAR_CART = 'CLEAR_CART'
export const TOGGLE_CART = 'TOGGLE_CART'

export const addToCart = (product, quantity = 1) => (dispatch, getState) => {
    dispatch({
        type: ADD_TO_CART,
        payload: { ...product, quantity }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cartReducer.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({ type: REMOVE_FROM_CART, payload: id })
    localStorage.setItem('cartItems', JSON.stringify(getState().cartReducer.cartItems))
}

export const updateCartQuantity = (id, quantity) => (dispatch, getState) => {
    dispatch({ type: UPDATE_CART_QUANTITY, payload: { id, quantity } })
    localStorage.setItem('cartItems', JSON.stringify(getState().cartReducer.cartItems))
}

export const clearCart = () => (dispatch, getState) => {
    dispatch({ type: CLEAR_CART })
    localStorage.setItem('cartItems', JSON.stringify([]))
}

export const toggleCart = () => ({ type: TOGGLE_CART })