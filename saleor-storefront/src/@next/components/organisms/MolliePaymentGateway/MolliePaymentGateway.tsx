import { Formik } from "formik";
import React from "react";

import { Radio } from "@components/atoms";

import * as S from "./styles";
import { IProps } from "./types";



export const mollieStatuses = [
  { id: 'ideal', 'description': "iDEAL", image:{svg: 'https://www.mollie.com/external/icons/payment-methods/ideal.svg'} },
  { id: 'creditcard', 'description': "Credit card", image:{svg: 'https://www.mollie.com/external/icons/payment-methods/creditcard.svg'} },
  { id: 'paypal', 'description': "Paypal", image:{svg: 'https://www.mollie.com/external/icons/payment-methods/paypal.svg'} },
];

/**
 * Dummy payment gateway.
 */
const MolliePaymentGateway: React.FC<IProps> = ({
                                                  processPayment,
                                                  formRef,
                                                  formId, gatewaySubType,
                                                  initialStatus,
                                                }: IProps) => {
  return (
      <Formik
          initialValues={{ status: initialStatus || mollieStatuses[0].token }}
          onSubmit={(values, { setSubmitting }) => {
            processPayment(`not-charged##${gatewaySubType}`);
            setSubmitting(false);
          }}
      >
        {({
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            isSubmitting,
            isValid,
          }) => {
          return  <S.Form id={formId} ref={formRef} onSubmit={handleSubmit} />
        }
        }
      </Formik>
  );
};

export { MolliePaymentGateway };
