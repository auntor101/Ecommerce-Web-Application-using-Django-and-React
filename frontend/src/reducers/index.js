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
})

export default allReducers