import gql from "graphql-tag";

export const paymentFragment = gql`
  fragment Payment on Payment {
    id
    gateway
    token
    transactions {
      id
      kind
      gatewayResponse
    }
    creditCard {
      brand
      firstDigits
      lastDigits
      expMonth
      expYear
    }
  }
`;

export const paymentOrderFragment = gql`
  fragment PaymentOrder on Payment {
    id
    gateway
    token
    order {
      id
      token
      number
    }
  }
`;
