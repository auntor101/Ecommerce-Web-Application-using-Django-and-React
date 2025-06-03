import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_UPDATE_QUANTITY,
    CART_CLEAR_ITEMS,
    CART_LOADING,
    CART_ERROR,
    TOGGLE_CART
} from '../constants/index'

const cartItemsFromStorage = localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) : []

const initialState = {
    cartItems: cartItemsFromStorage,
    isOpen: false,
    loading: false,
    error: null
}

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case CART_LOADING:
            return { ...state, loading: true };
            
        case CART_ADD_ITEM:
            const item = action.payload
            const existItem = state.cartItems.find(x => x.id === item.id)
            
            if (existItem) {
                return {
                    ...state,
                    loading: false,
                    error: null,
                    cartItems: state.cartItems.map(x =>
                        x.id === existItem.id 
                            ? { ...x, quantity: x.quantity + item.quantity }
                            : x
                    )
                }
            } else {
                return {
                    ...state,
                    loading: false,
                    error: null,
                    cartItems: [...state.cartItems, item]
                }
            }
            
        case CART_REMOVE_ITEM:
            return {
                ...state,
                loading: false,
                error: null,
                cartItems: state.cartItems.filter(x => x.id !== action.payload)
            }
            
        case CART_UPDATE_QUANTITY:
            return {
                ...state,
                loading: false,
                error: null,
                cartItems: state.cartItems.map(x =>
                    x.id === action.payload.id
                        ? { ...x, quantity: action.payload.quantity }
                        : x
                )
            }
            
        case CART_CLEAR_ITEMS:
            return { 
                ...state, 
                loading: false,
                error: null,
                cartItems: [] 
            }
            
        case TOGGLE_CART:
            return { ...state, isOpen: !state.isOpen }
            
        case CART_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
            
        default:
            return state
    }
} 