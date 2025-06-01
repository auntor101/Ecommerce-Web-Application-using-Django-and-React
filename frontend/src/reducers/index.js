import { combineReducers } from "redux";
import {
    productsListReducer,
    productDetailsReducer,
    createProductReducer,
    updateProductReducer,
    deleteProductReducer,
    changeDeliveryStatusReducer,
} from "./productReducers";

import {
    userLoginReducer,
    userRegisterReducer,
    userDetailsReducer,
    userDetailsUpdateReducer,
    deleteUserAccountReducer,
    checkTokenValidationReducer,
    getSingleAddressReducer,
    getAllAddressesOfUserReducer,
    createUserAddressReducer,
    updateUserAddressReducer,
    deleteUserAddressReducer,
    getAllOrdersReducer,
} from "./userReducers";

// Import new reducers
import { cartReducer } from "./cartReducers";
import { wishlistReducer } from "./wishlistReducers";

const allReducers = combineReducers({
    productsListReducer,
    productDetailsReducer,
    createProductReducer,
    updateProductReducer,
    deleteProductReducer,
    userLoginReducer,
    userRegisterReducer,    
    getSingleAddressReducer,
    getAllAddressesOfUserReducer,
    createUserAddressReducer,
    updateUserAddressReducer,
    deleteUserAddressReducer,
    getAllOrdersReducer,
    changeDeliveryStatusReducer,
    checkTokenValidationReducer,
    userDetailsReducer,
    userDetailsUpdateReducer,
    deleteUserAccountReducer,
    // Add new reducers
    cartReducer,
    wishlistReducer,
})

export default allReducers