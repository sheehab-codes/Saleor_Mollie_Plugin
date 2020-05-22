import { Formik } from "formik";
import React from "react";

import { Radio } from "@components/atoms";

import * as S from "./styles";
import { IProps } from "./types";

export const mollieStatuses = [
  { token: "charged", label: "Charged" },
  { token: "authorized", label: "Authorized" },
  { token: "fully-refunded", label: "Fully refunded" },
  { token: "not-charged", label: "Not charged" },
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
      initialValues={{ status: initialStatus || mollieStatuses[0].token }}
      onSubmit={(values, { setSubmitting }) => {
        processPayment('not-charged');
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
      }) => (
        <S.Form id={formId} ref={formRef} onSubmit={handleSubmit}>
          
        </S.Form>
      )}
    </Formik>
  );
};

export { MolliePaymentGateway };
