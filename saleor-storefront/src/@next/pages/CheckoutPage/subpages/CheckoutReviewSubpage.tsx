import React, {
  forwardRef,
  RefForwardingComponent,
  useImperativeHandle,
  useState,
} from "react";
import { RouteComponentProps, useHistory } from "react-router";

import { CheckoutReview } from "@components/organisms";
import { statuses as dummyStatuses } from "@components/organisms/DummyPaymentGateway";
import { useCheckout } from "@sdk/react";
import { CHECKOUT_STEPS } from "@temp/core/config";
import { IFormError } from "@types";

export interface ICheckoutReviewSubpageHandles {
  complete: () => void;
}
interface IProps extends RouteComponentProps<any> {
  selectedPaymentGatewayToken?: string;
  changeSubmitProgress: (submitInProgress: boolean) => void;
}

const CheckoutReviewSubpageWithRef: RefForwardingComponent<
  ICheckoutReviewSubpageHandles,
  IProps
> = (
  { selectedPaymentGatewayToken, changeSubmitProgress, ...props }: IProps,
  ref
) => {
  const history = useHistory();
  const { checkout, payment, completeCheckout } = useCheckout();

  const [errors, setErrors] = useState<IFormError[]>([]);

  const checkoutShippingAddress = checkout?.shippingAddress
    ? {
        ...checkout?.shippingAddress,
        phone: checkout?.shippingAddress?.phone || undefined,
      }
    : undefined;

  const checkoutBillingAddress = checkout?.billingAddress
    ? {
        ...checkout?.billingAddress,
        phone: checkout?.billingAddress?.phone || undefined,
      }
    : undefined;

  const getPaymentMethodDescription = () => {
    if (payment?.gateway === "mirumee.payments.dummy") {
      return `Dummy: ${
        dummyStatuses.find(
          status => status.token === selectedPaymentGatewayToken
        )?.label
      }`;
    } else if (payment?.gateway?.startsWith("mirumee.payments.external")) {
      return `External gateway`;
    } else if (payment?.creditCard) {
      return `Ending in ${payment?.creditCard.lastDigits}`;
    }
    return ``;
  };

  useImperativeHandle(ref, () => ({
    complete: async () => {
      // If gateway uses external checkout process,
      // Redirect the user to checkout flow
      changeSubmitProgress(true);
      const { data, dataError } = await completeCheckout();
      if(
        data?.paymentStatus === "NOT_CHARGED" && 
        data?.payments.length > 0 && 
        data?.payments[0].gateway?.startsWith("mirumee.payments.external")
      ){
        const parsedRespone = JSON.parse(data.payments[0].transactions[0].gatewayResponse)
        if(parsedRespone.checkoutUrl){
          history.push({
            pathname: '/finalize-order',
          });
          window.location.href = parsedRespone.checkoutUrl
        }
      } else {
        changeSubmitProgress(false);
        const errors = dataError?.error;
        if (errors) {
          setErrors(errors);
        } else {
          setErrors([]);
          history.push({
            pathname: CHECKOUT_STEPS[3].nextStepLink,
            state: {
              id: data?.id,
              orderNumber: data?.number,
              token: data?.token,
            },
          });
        }
      }
    },
  }));

  return (
    <CheckoutReview
      {...props}
      shippingAddress={checkoutShippingAddress}
      billingAddress={checkoutBillingAddress}
      shippingMethodName={checkout?.shippingMethod?.name}
      paymentMethodName={getPaymentMethodDescription()}
      email={checkout?.email}
      errors={errors}
    />
  );
};

const CheckoutReviewSubpage = forwardRef(CheckoutReviewSubpageWithRef);

export { CheckoutReviewSubpage };
