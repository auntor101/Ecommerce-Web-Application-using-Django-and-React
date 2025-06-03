export const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST'
export const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST'

export const addToWishlist = (product) => (dispatch, getState) => {
    dispatch({ type: ADD_TO_WISHLIST, payload: product })
    localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlistReducer.items))
}

export const removeFromWishlist = (id) => (dispatch, getState) => {
    dispatch({ type: REMOVE_FROM_WISHLIST, payload: id })
    localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlistReducer.items))
} 