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
                                                    formId,
                                                    initialStatus,
                                                }: IProps) => {
    return (
        <Formik
            initialValues={{ status: initialStatus || mollieStatuses[0].id }}
            onSubmit={(values, { setSubmitting }) => {
                processPayment(values.status);
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
                return  <S.Form id={formId} ref={formRef} onSubmit={handleSubmit}>
                    {mollieStatuses.map(({ id, description, image }) => {
                        return (
                            <S.Status key={id}>
                                <Radio
                                    data-cy={`checkoutPaymentGatewayDummyStatus${id}Input`}
                                    key={id}
                                    type="radio"
                                    name="status"
                                    value={id}
                                    checked={values.status === id}
                                    onChange={handleChange}
                                >
                  <span
                      data-cy={`checkoutPaymentGatewayDummyStatus${id}Label`}
                  >
                    <img src={image.svg} /> {description}
                  </span>
                                </Radio>
                            </S.Status>
                        );
                    })}
                </S.Form>
            }
            }
        </Formik>
    );
};

export { MolliePaymentGateway };
