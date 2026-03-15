import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_UPDATE_QUANTITY,
    CART_CLEAR_ITEMS,
    TOGGLE_CART
} from '../constants/index'

export const addToCart = (product, quantity = 1) => (dispatch, getState) => {
    dispatch({
        type: CART_ADD_ITEM,
        payload: { ...product, quantity }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cartReducer.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: id })
    localStorage.setItem('cartItems', JSON.stringify(getState().cartReducer.cartItems))
}

export const updateCartQuantity = (id, quantity) => (dispatch, getState) => {
    dispatch({ type: CART_UPDATE_QUANTITY, payload: { id, quantity } })
    localStorage.setItem('cartItems', JSON.stringify(getState().cartReducer.cartItems))
}

export const clearCart = () => (dispatch, getState) => {
    dispatch({ type: CART_CLEAR_ITEMS })
    localStorage.setItem('cartItems', JSON.stringify([]))
}

export const toggleCart = () => ({ type: TOGGLE_CART }) 