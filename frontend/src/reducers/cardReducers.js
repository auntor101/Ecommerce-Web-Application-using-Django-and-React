// All Stripe and card management reducers removed as Stripe is being removed.
// File intentionally left blank after removing Stripe payment logic.

import {
  CARD_PAYMENT_REQUEST,
  CARD_PAYMENT_SUCCESS,
  CARD_PAYMENT_FAIL
} from '../constants/index';

export const cardPaymentReducer = (state = {}, action) => {
  switch (action.type) {
    case CARD_PAYMENT_REQUEST:
      return { loading: true };
    case CARD_PAYMENT_SUCCESS:
      return { loading: false, success: true, paymentResult: action.payload };
    case CARD_PAYMENT_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};