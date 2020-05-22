/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PaymentSecureConfirm
// ====================================================

export interface PaymentSecureConfirm_paymentSecureConfirm_errors {
  __typename: "Error";
  /**
   * Name of a field that caused the error. A value of `null` indicates that the
   * error isn't associated with a particular field.
   */
  field: string | null;
  /**
   * The error message.
   */
  message: string | null;
}

export interface PaymentSecureConfirm_paymentSecureConfirm_payment_order {
  __typename: "Order";
  /**
   * The ID of the object.
   */
  id: string;
  token: string;
  /**
   * User-friendly number of an order.
   */
  number: string | null;
}

export interface PaymentSecureConfirm_paymentSecureConfirm_payment {
  __typename: "Payment";
  /**
   * The ID of the object.
   */
  id: string;
  gateway: string;
  token: string;
  order: PaymentSecureConfirm_paymentSecureConfirm_payment_order | null;
}

export interface PaymentSecureConfirm_paymentSecureConfirm {
  __typename: "PaymentSecureConfirm";
  /**
   * List of errors that occurred executing the mutation.
   */
  errors: PaymentSecureConfirm_paymentSecureConfirm_errors[];
  /**
   * Updated payment.
   */
  payment: PaymentSecureConfirm_paymentSecureConfirm_payment | null;
}

export interface PaymentSecureConfirm {
  /**
   * Confirms payment in a two-step process like 3D secure
   */
  paymentSecureConfirm: PaymentSecureConfirm_paymentSecureConfirm | null;
}

export interface PaymentSecureConfirmVariables {
  paymentId: string;
}
