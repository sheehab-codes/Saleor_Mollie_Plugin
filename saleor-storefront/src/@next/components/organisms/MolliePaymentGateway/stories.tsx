import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { MolliePaymentGateway } from ".";

const processPayment = action("processPayment");

storiesOf("@components/organisms/MolliePaymentGateway", module)
  .addParameters({ component: MolliePaymentGateway })
  .add("default", () => (
    <MolliePaymentGateway processPayment={processPayment} />
  ));
