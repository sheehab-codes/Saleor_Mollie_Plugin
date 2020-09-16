from typing import TYPE_CHECKING

from saleor.plugins.base_plugin import BasePlugin, ConfigurationTypeField
from mollie.api.client import Client
from mollie.api.error import Error
import json

from . import (
    GatewayConfig,
    authorize,
    capture,
    confirm,
    get_client_token,
    process_payment,
    refund,
    void,
)

GATEWAY_NAME = "Mollie"

if TYPE_CHECKING:
    from ...interface import GatewayResponse, PaymentData, TokenConfig


def require_active_plugin(fn):
    def wrapped(self, *args, **kwargs):
        previous = kwargs.get("previous_value", None)
        if not self.active:
            return previous
        return fn(self, *args, **kwargs)

    return wrapped


class MollieGatewayPlugin(BasePlugin):
    PLUGIN_ID = "mirumee.payments.external.mollie"
    PLUGIN_NAME = GATEWAY_NAME
    DEFAULT_ACTIVE = True
    DEFAULT_CONFIGURATION = [
        {"name": "API key", "value": None},
        {"name": "Profile ID", "value": None},
    ]
    CONFIG_STRUCTURE = {
        "Profile ID": {
            "type": ConfigurationTypeField.STRING,
            "help_text": "Provide Mollie Web Profile ID",
            "label": "Profile ID",
        },
        "API key": {
            "type": ConfigurationTypeField.SECRET,
            "help_text": "Provide Mollie Web Profile API key",
            "label": "API key",
        },
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        configuration = {item["name"]: item["value"] for item in self.configuration}
        self.config = GatewayConfig(
            gateway_name=GATEWAY_NAME,
            auto_capture=True,
            connection_params={
                "profile_id": configuration["Profile ID"],
                "api_key": configuration["API key"],
            },
            store_customer=False,
        )

    def _get_gateway_config(self):
        return self.config

    @require_active_plugin
    def authorize_payment(
            self, payment_information: "PaymentData", previous_value
    ) -> "GatewayResponse":
        return authorize(payment_information, self._get_gateway_config())

    @require_active_plugin
    def capture_payment(
            self, payment_information: "PaymentData", previous_value
    ) -> "GatewayResponse":
        return capture(payment_information, self._get_gateway_config())

    @require_active_plugin
    def confirm_payment(
            self, payment_information: "PaymentData", previous_value
    ) -> "GatewayResponse":
        return confirm(payment_information, self._get_gateway_config())

    @require_active_plugin
    def refund_payment(
            self, payment_information: "PaymentData", previous_value
    ) -> "GatewayResponse":
        return refund(payment_information, self._get_gateway_config())

    @require_active_plugin
    def void_payment(
            self, payment_information: "PaymentData", previous_value
    ) -> "GatewayResponse":
        return void(payment_information, self._get_gateway_config())

    @require_active_plugin
    def process_payment(
            self, payment_information: "PaymentData", previous_value
    ) -> "GatewayResponse":
        return process_payment(payment_information, self._get_gateway_config())

    @require_active_plugin
    def get_client_token(self, token_config: "TokenConfig", previous_value):
        return get_client_token()

    @require_active_plugin
    def get_payment_config(self, previous_value):
        config = self._get_gateway_config()
        # Here with the payment gateway info we are sending available methods as well.
        try:
            mollie_client = prepare_api_client(config)
            methods = mollie_client.methods.list()
            return [
                {"field": "store_customer_card", "value": config.store_customer},
                {"field": "store_payment_gateway", "value": json.dumps({
                    "methods": list(methods)
                })}
            ]
        except Error as ex:
            return [
                {"field": "store_customer_card", "value": config.store_customer},
                {"field": "store_payment_gateway", "value": json.dumps({
                    "methods": list([])
                })}
            ]


def prepare_api_client(config: GatewayConfig):
    mollie_client = Client()
    mollie_client.set_api_key(config.connection_params['api_key'])
    return mollie_client
