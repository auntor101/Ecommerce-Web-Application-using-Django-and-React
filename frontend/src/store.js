import {createStore, applyMiddleware} from 'redux'
import { composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import allReducers from './reducers/index'


const readStoredJSON = (key, fallbackValue) => {
    try {
        const rawValue = localStorage.getItem(key)
        return rawValue ? JSON.parse(rawValue) : fallbackValue
    } catch (error) {
        localStorage.removeItem(key)
        return fallbackValue
    }
}

const middleware = [thunk]

const userInfoFromStorage = readStoredJSON('userInfo', null)
const cartItemsFromStorage = readStoredJSON('cartItems', [])
const wishlistItemsFromStorage = readStoredJSON('wishlistItems', [])

let initialState = {
    userLoginReducer: { userInfo: userInfoFromStorage },
    cartReducer: { 
        cartItems: cartItemsFromStorage,
        isOpen: false 
    },
    wishlistReducer: { 
        items: wishlistItemsFromStorage 
    },
    cardPaymentReducer: {},
}

const store = createStore(allReducers, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store