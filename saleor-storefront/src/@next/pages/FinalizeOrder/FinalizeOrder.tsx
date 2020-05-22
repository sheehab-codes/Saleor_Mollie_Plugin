import React from "react";
import { useHistory } from "react-router-dom";
import { StringParam, useQueryParams } from 'use-query-params';
import { useCheckout } from "@sdk/react";
import { CHECKOUT_STEPS } from "@temp/core/config";
import { Loader } from "@components/atoms";
import { Container } from "@components/templates";

import * as S from "./styles";
import { IProps } from "./types";

const FinalizeOrder: React.FC<IProps> = ({}: IProps) => {
  const history = useHistory();

  const [query] = useQueryParams({
    token: StringParam,
  });
  const { confirmPayment } = useCheckout();

  React.useEffect(() => {
    if(query.token){
      confirmPayment(query.token).then( (res) => {
        const errors = res.dataError
        if (errors) {
          console.log(errors.error)
        } else {
          history.push({
            pathname: CHECKOUT_STEPS[3].nextStepLink,
            state: {
              id: res.data?.order.id,
              orderNumber: res.data?.order.number,
              token: res.data?.order.token,
            },
          });
        }
      })
    }
  }, []);
  return (
    <Container>
      <S.Wrapper>
        <S.RedirectHeader>
        {query.token ? "Confirming payment..." : "Redirecting..."}
        </S.RedirectHeader>
        <S.Paragraph>
          You are being redirected, please wait.
        </S.Paragraph>
        <Loader />
      </S.Wrapper>
    </Container>
  );
};

export { FinalizeOrder };
