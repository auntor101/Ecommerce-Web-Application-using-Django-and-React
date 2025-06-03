// All Stripe and card management logic removed as Stripe is being removed.
// File intentionally left blank after removing Stripe payment logic.

import axios from 'axios';
import {
    CARD_PAYMENT_REQUEST,
    CARD_PAYMENT_SUCCESS,
    CARD_PAYMENT_FAIL
} from '../constants/index';
import { toast } from 'react-toastify';

export const processCardPayment = (paymentData) => async (dispatch, getState) => {
    try {
        dispatch({ type: CARD_PAYMENT_REQUEST });
        
        const { userLoginReducer: { userInfo } } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        
        const { data } = await axios.post('/payments/card/', paymentData, config);
        
        dispatch({
            type: CARD_PAYMENT_SUCCESS,
            payload: data
        });
        
        return data;
    } catch (error) {
        const message = error.response?.data?.detail || error.message;
        toast.error(message);
        dispatch({
            type: CARD_PAYMENT_FAIL,
            payload: message
        });
        throw error;
    }
};