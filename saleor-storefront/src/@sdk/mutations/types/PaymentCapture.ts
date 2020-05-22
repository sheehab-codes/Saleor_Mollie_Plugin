/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PaymentCapture
// ====================================================

export interface PaymentCapture_paymentCapture_errors {
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

export interface PaymentCapture_paymentCapture_payment_order {
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

export interface PaymentCapture_paymentCapture_payment {
  __typename: "Payment";
  /**
   * The ID of the object.
   */
  id: string;
  gateway: string;
  token: string;
  order: PaymentCapture_paymentCapture_payment_order | null;
}

export interface PaymentCapture_paymentCapture {
  __typename: "PaymentCapture";
  /**
   * List of errors that occurred executing the mutation.
   */
  errors: PaymentCapture_paymentCapture_errors[];
  /**
   * Updated payment.
   */
  payment: PaymentCapture_paymentCapture_payment | null;
}

export interface PaymentCapture {
  /**
   * Captures the authorized payment amount.
   */
  paymentCapture: PaymentCapture_paymentCapture | null;
}

export interface PaymentCaptureVariables {
  paymentId: string;
}
