import uuid
import ast
from urllib.parse import urlencode

import graphene

from mollie.api.client import Client
from mollie.api.error import Error

from ... import ChargeStatus, TransactionKind
from ...interface import GatewayConfig, GatewayResponse, PaymentData
from ....core.emails import prepare_url
from ....checkout.models import Checkout


def dummy_success():
    return True


def get_client_token(**_):
    return str(uuid.uuid4())

def prepare_api_client(config: GatewayConfig):
    mollie_client = Client()
    mollie_client.set_api_key(config.connection_params['api_key'])
    return mollie_client

def authorize(payment_information: PaymentData, config: GatewayConfig) -> GatewayResponse:
    success = True
    error = None

    checkout_url = None
    extra_data = ast.literal_eval(payment_information.extra_data)

    # Prepare redirect URL for storfront
    payment_node_id = graphene.Node.to_global_id("Payment", payment_information.payment_id)
    params = urlencode({"token": payment_node_id})
    redirect_url = prepare_url(params, extra_data['redirect_url'])
    transaction_id = payment_information.token
    try:
        mollie_client = prepare_api_client(config)

        payment = mollie_client.payments.create({
            'amount': {
                'currency': str(payment_information.currency),
                'value': f"{payment_information.amount:.2f}"
            },
            'description': 'Goldflorin payment',
            'redirectUrl': redirect_url,
            'webhookUrl': 'https://webhook.site/e9f8d2b8-527f-4fd3-a335-c0fe46d62d61',
        })

        transaction_id = payment['id']
        checkout_url = payment['_links']['checkout']['href']
    except Error as err:
        print('API call failed: {error}'.format(error=err))
        error = err
        success = False

    if not success:
        error = "Unable to authorize transaction"

    return GatewayResponse(
        is_success=success,
        action_required=False,
        kind=TransactionKind.AUTH,
        amount=payment_information.amount,
        currency=payment_information.currency,
        transaction_id=transaction_id,
        error=error,
        raw_response={"checkoutUrl": checkout_url}
    )


def void(payment_information: PaymentData, config: GatewayConfig) -> GatewayResponse:
    error = None
    success = dummy_success()
    if not success:
        error = "Unable to void the transaction."

    print('voiding payment')
    return GatewayResponse(
        is_success=success,
        action_required=False,
        kind=TransactionKind.VOID,
        amount=payment_information.amount,
        currency=payment_information.currency,
        transaction_id=payment_information.token,
        error=error,
    )


def capture(payment_information: PaymentData, config: GatewayConfig) -> GatewayResponse:
    """Perform capture transaction."""
    error = None
    success = dummy_success()

    print('creating payment capture')

    checkout_url = None
    extra_data = ast.literal_eval(payment_information.extra_data)

    # Prepare redirect URL for storfront
    checkout_node_id = graphene.Node.to_global_id("Checkout", payment_information.checkout_id)

    params = urlencode({"token": checkout_node_id})
    redirect_url = prepare_url(params, extra_data['redirect_url'])

    try:
        mollie_client = prepare_api_client(config)
        print('getting payment status from mollie')
        # payment = mollie_client.payments.get({
        #     'id': 'Goldflorin payment',
        # })

        # checkout_url = payment['_links']['checkout']['href']
    except Error as err:
        print('API call failed: {error}'.format(error=err))
        error = err
        success = False

    if not success:
        error = "Unable to process capture"

    return GatewayResponse(
        is_success=success,
        action_required=False,
        kind=TransactionKind.CAPTURE,
        amount=payment_information.amount,
        currency=payment_information.currency,
        transaction_id=payment_information.token,
        error=error,
        raw_response={"checkoutUrl": checkout_url}
    )


def confirm(payment_information: PaymentData, config: GatewayConfig) -> GatewayResponse:
    """Perform confirm transaction."""
    error = None
    success = False

    try:
        mollie_client = prepare_api_client(config)
        payment = mollie_client.payments.get(payment_information.token)
        if payment.is_paid():
            success = True
    except Error as err:
        print('API call failed: {error}'.format(error=err))
        error = err
        success = False

    return GatewayResponse(
        is_success=success,
        action_required=False,
        kind=TransactionKind.CAPTURE,
        amount=payment_information.amount,
        currency=payment_information.currency,
        transaction_id=payment_information.token,
        error=error,
    )


def refund(payment_information: PaymentData, config: GatewayConfig) -> GatewayResponse:
    error = None
    success = False
    transaction_id = payment_information.token
    try:
        mollie_client = prepare_api_client(config)
        refund = mollie_client.payment_refunds.with_parent_id(payment_information.token).create({
            'amount': {
                'currency': str(payment_information.currency),
                'value': f"{payment_information.amount:.2f}"
            },
        })
        transaction_id = refund['id']
        success = True
    except Error as err:
        print('API call failed: {error}'.format(error=err))
        error = err
        success = False

    if not success:
        error = "Unable to process refund"
    return GatewayResponse(
        is_success=success,
        action_required=False,
        kind=TransactionKind.REFUND,
        amount=payment_information.amount,
        currency=payment_information.currency,
        transaction_id=transaction_id,
        error=error,
    )


def process_payment(
    payment_information: PaymentData, config: GatewayConfig
) -> GatewayResponse:
    """Process the payment."""
    response = authorize(payment_information, config)
    return response
