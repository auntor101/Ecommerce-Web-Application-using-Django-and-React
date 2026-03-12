import {
  CARD_PAYMENT_REQUEST,
  CARD_PAYMENT_SUCCESS,
  CARD_PAYMENT_FAIL,
  CARD_CREATE_RESET
} from '../constants/index';

export const cardPaymentReducer = (state = {}, action) => {
  switch (action.type) {
    case CARD_PAYMENT_REQUEST:
      return { loading: true };
    case CARD_PAYMENT_SUCCESS:
      return { loading: false, success: true, paymentResult: action.payload };
    case CARD_PAYMENT_FAIL:
      return { loading: false, error: action.payload };
    case CARD_CREATE_RESET:
      return {};
    default:
      return state;
  }
};