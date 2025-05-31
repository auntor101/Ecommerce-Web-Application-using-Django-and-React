import {createStore, applyMiddleware} from 'redux'
import { composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import allReducers from './reducers/index'

const middleware = [thunk]

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const wishlistItemsFromStorage = localStorage.getItem('wishlistItems') ? JSON.parse(localStorage.getItem('wishlistItems')) : []

let initialState = {
    userLoginReducer: { userInfo: userInfoFromStorage },
    cartReducer: { cartItems: cartItemsFromStorage, isOpen: false },
    wishlistReducer: { items: wishlistItemsFromStorage }
}

const store = createStore(allReducers, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store