/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PaymentOrder
// ====================================================

export interface PaymentOrder_order {
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

export interface PaymentOrder {
  __typename: "Payment";
  /**
   * The ID of the object.
   */
  id: string;
  gateway: string;
  token: string;
  order: PaymentOrder_order | null;
}
