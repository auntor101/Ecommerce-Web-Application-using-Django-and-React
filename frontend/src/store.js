import {createStore, applyMiddleware} from 'redux'
import { composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import allReducers from './reducers/index'
import { cartReducer } from './reducers/cartReducers';
import { wishlistReducer } from './reducers/wishlistReducers';
import { cardPaymentReducer } from './reducers/cardReducers';

const middleware = [thunk]

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const wishlistItemsFromStorage = localStorage.getItem('wishlistItems') ? JSON.parse(localStorage.getItem('wishlistItems')) : []

let initialState = {
    userLoginReducer: { userInfo: userInfoFromStorage },
    cartReducer: { 
        cartItems: cartItemsFromStorage,
        isOpen: false 
    },
    wishlistReducer: { 
        items: wishlistItemsFromStorage 
    },
    cardPaymentReducer: {
        // Initialize cardPaymentReducer state
    },
}

const store = createStore(allReducers, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store