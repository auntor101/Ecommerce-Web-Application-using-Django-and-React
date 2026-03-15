import {
    ADD_TO_WISHLIST,
    REMOVE_FROM_WISHLIST
} from '../actions/wishlistActions'

const readStoredWishlistItems = () => {
    try {
        const rawValue = localStorage.getItem('wishlistItems')
        return rawValue ? JSON.parse(rawValue) : []
    } catch (error) {
        localStorage.removeItem('wishlistItems')
        return []
    }
}

const wishlistItemsFromStorage = readStoredWishlistItems()

const initialState = {
    items: wishlistItemsFromStorage
}

export const wishlistReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_WISHLIST:
            const existItem = state.items.find(item => item.id === action.payload.id)
            if (existItem) {
                return state
            }
            return { 
                ...state, 
                items: [...state.items, action.payload] 
            }
            
        case REMOVE_FROM_WISHLIST:
            return { 
                ...state, 
                items: state.items.filter(item => item.id !== action.payload) 
            }
            
        default:
            return state
    }
}