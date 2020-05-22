import React from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

import { ThankYou } from "@components/organisms";
import { BASE_URL } from "@temp/core/config";
import { generateGuestOrderDetailsUrl } from "@utils/core";

import { IProps } from "./types";

const ThankYouPage: React.FC<IProps> = ({}: IProps) => {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();

  const { token, orderNumber } = location.state ? location.state : params as any;

  return (
    <ThankYou
      continueShopping={() => history.push(BASE_URL)}
      orderNumber={orderNumber}
      orderDetails={() => history.push(generateGuestOrderDetailsUrl(token))}
    />
  );
};

export { ThankYouPage };
