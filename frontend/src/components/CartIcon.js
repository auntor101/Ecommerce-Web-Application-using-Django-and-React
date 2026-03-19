import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleCart } from '../actions/cartActions'

function CartIcon() {
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.cartReducer)
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <button
            onClick={() => dispatch(toggleCart())}
            className="cart-icon-nav"
            aria-label="Open cart"
        >
            <i className="fas fa-shopping-bag" />
            {itemCount > 0 && (
                <span className="cart-icon-badge">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </button>
    )
}

export default CartIcon