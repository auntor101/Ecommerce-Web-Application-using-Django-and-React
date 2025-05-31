import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
} from '../actions/cartActions'

const cartItemsFromStorage = localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) : []

const initialState = {
    cartItems: cartItemsFromStorage,
    isOpen: false
}

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const item = action.payload
            const existItem = state.cartItems.find(x => x.id === item.id)
            
            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x =>
                        x.id === existItem.id 
                            ? { ...x, quantity: x.quantity + item.quantity }
                            : x
                    )
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
            
        case REMOVE_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.id !== action.payload)
            }
            
        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartItems: state.cartItems.map(x =>
                    x.id === action.payload.id
                        ? { ...x, quantity: action.payload.quantity }
                        : x
                )
            }
            
        case CLEAR_CART:
            return { ...state, cartItems: [] }
            
        case TOGGLE_CART:
            return { ...state, isOpen: !state.isOpen }
            
        default:
            return state
    }
}