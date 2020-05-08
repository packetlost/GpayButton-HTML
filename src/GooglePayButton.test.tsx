import './__setup__/mocks';

import React from 'react';
import ReactDOM from 'react-dom';
import GooglePayButton, { Props } from './GooglePayButton';
import defaults from './__setup__/defaults';

interface TestComponent<TComponent> {
  component: TComponent,
  unmount: () => void,
}

function createTestButton(props: Props): Promise<TestComponent<GooglePayButton>> {
  return new Promise(resolve => {
    const div = document.createElement('div');
    const ref = React.createRef<GooglePayButton>();

    const component = (
      <GooglePayButton
        ref={ref}
        {...props}
        onReadyToPayChange={(isReadyToPay) => {
          resolve({
            component: ref.current!,
            unmount: () => {
              ReactDOM.unmountComponentAtNode(div);
            },
          });

          if (props.onReadyToPayChange) {
            props.onReadyToPayChange(isReadyToPay);
          }
        }}
      />
    );

    ReactDOM.render(component, div);
  });
}

describe('Render', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<GooglePayButton {...defaults} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('Default *required* parameters', () => {
  it('maintains default request parameters', async () => {
    const testButton = await createTestButton(defaults);
    const button = testButton.component;

    const request = button.createLoadPaymentDataRequest();

    expect(request.shippingAddressRequired).toBe(undefined);
    expect(request.shippingOptionRequired).toBe(undefined);
    expect(request.allowedPaymentMethods[0].parameters.billingAddressRequired).toBe(undefined);

    testButton.unmount();
  });

  it('sets default required parameters when options are supplied', async () => {
    const testButton = await createTestButton({
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingAddressParameters: {
          phoneNumberRequired: false,
          allowedCountryCodes: [],
        },
        shippingOptionParameters: {
          shippingOptions: [],
        },
        allowedPaymentMethods: [{
          ...defaults.paymentRequest.allowedPaymentMethods[0],
          parameters: {
            ...defaults.paymentRequest.allowedPaymentMethods[0].parameters,
            billingAddressParameters: {
              format: 'MIN',
            }
          }
        }]
      }
    });
    const button = testButton.component;

    const request = button.createLoadPaymentDataRequest();

    expect(request.shippingAddressRequired).toBe(true);
    expect(request.shippingOptionRequired).toBe(true);
    expect(request.allowedPaymentMethods[0].parameters.billingAddressRequired).toBe(true);

    testButton.unmount();
  });

  it('does not override required parameters when options are supplied', async () => {
    const testButton = await createTestButton({
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingAddressRequired: false,
        shippingAddressParameters: {
          phoneNumberRequired: false,
          allowedCountryCodes: [],
        },
        shippingOptionRequired: false,
        shippingOptionParameters: {
          shippingOptions: [],
        },
        allowedPaymentMethods: [{
          ...defaults.paymentRequest.allowedPaymentMethods[0],
          parameters: {
            ...defaults.paymentRequest.allowedPaymentMethods[0].parameters,
            billingAddressRequired: false,
            billingAddressParameters: {
              format: 'MIN',
            }
          }
        }]
      }
    });
    const button = testButton.component;

    const request = button.createLoadPaymentDataRequest();

    expect(request.shippingAddressRequired).toBe(false);
    expect(request.shippingOptionRequired).toBe(false);
    expect(request.allowedPaymentMethods[0].parameters.billingAddressRequired).toBe(false);

    testButton.unmount();
  });
});

describe('Callbacks', () => {
  it('maintains default callback values', async () => {
    const testButton = await createTestButton(defaults);
    const button = testButton.component;

    const options = button.createClientOptions();
    const request = button.createLoadPaymentDataRequest();

    expect(options.paymentDataCallbacks).toBe(undefined);
    expect(request.callbackIntents).toBe(undefined);

    testButton.unmount();
  });

  it('does not override callbacks when already set', async () => {
    const testButton = await createTestButton({
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingAddressRequired: true,
        shippingOptionRequired: true,
        callbackIntents: [],
      },
      onPaymentDataChanged: () => ({}),
      onPaymentAuthorized: () => ({ transactionState: 'SUCCESS' }),
    });
    const button = testButton.component;

    const options = button.createClientOptions();
    const request = button.createLoadPaymentDataRequest();

    expect(options.paymentDataCallbacks?.onPaymentDataChanged).toBeTruthy();
    expect(request.callbackIntents).not.toContain('PAYMENT_METHOD');
    expect(request.callbackIntents).not.toContain('SHIPPING_OPTION');
    expect(request.callbackIntents).not.toContain('SHIPPING_ADDRESS');
    expect(request.callbackIntents).not.toContain('PAYMENT_AUTHORIZATION');

    testButton.unmount();
  });

  it('populates callbacks when onPaymentDataChanged is set', async () => {
    const testButton = await createTestButton({
      ...defaults,
      onPaymentDataChanged: () => ({}),
    });
    const button = testButton.component;

    const options = button.createClientOptions();
    const request = button.createLoadPaymentDataRequest();

    expect(options.paymentDataCallbacks?.onPaymentDataChanged).toBeTruthy();
    expect(request.callbackIntents).toContain('PAYMENT_METHOD');
    expect(request.callbackIntents).not.toContain('SHIPPING_OPTION');
    expect(request.callbackIntents).not.toContain('SHIPPING_ADDRESS');
    expect(request.callbackIntents).not.toContain('PAYMENT_AUTHORIZATION');

    testButton.unmount();
  });

  it('populates callbacks when onPaymentDataChanged and shippingAddressRequired is set', async () => {
    const testButton = await createTestButton({
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingAddressRequired: true,
      },
      onPaymentDataChanged: () => ({}),
    });
    const button = testButton.component;

    const options = button.createClientOptions();
    const request = button.createLoadPaymentDataRequest();

    expect(options.paymentDataCallbacks?.onPaymentDataChanged).toBeTruthy();
    expect(request.callbackIntents).toContain('PAYMENT_METHOD');
    expect(request.callbackIntents).toContain('SHIPPING_ADDRESS');
    expect(request.callbackIntents).not.toContain('SHIPPING_OPTION');
    expect(request.callbackIntents).not.toContain('PAYMENT_AUTHORIZATION');

    testButton.unmount();
  });

  it('populates callbacks when onPaymentDataChanged and shippingOptionRequired is set', async () => {
    const testButton = await createTestButton({
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        shippingOptionRequired: true,
      },
      onPaymentDataChanged: () => ({}),
    });
    const button = testButton.component;

    const options = button.createClientOptions();
    const request = button.createLoadPaymentDataRequest();

    expect(options.paymentDataCallbacks?.onPaymentDataChanged).toBeTruthy();
    expect(request.callbackIntents).toContain('PAYMENT_METHOD');
    expect(request.callbackIntents).not.toContain('SHIPPING_ADDRESS');
    expect(request.callbackIntents).toContain('SHIPPING_OPTION');
    expect(request.callbackIntents).not.toContain('PAYMENT_AUTHORIZATION');

    testButton.unmount();
  });

  it('populates callbacks when onPaymentAuthorized is set', async () => {
    const testButton = await createTestButton({
      ...defaults,
      onPaymentAuthorized: () => ({ transactionState: 'SUCCESS' }),
    });
    const button = testButton.component;

    const options = button.createClientOptions();
    const request = button.createLoadPaymentDataRequest();

    expect(options.paymentDataCallbacks?.onPaymentAuthorized).toBeTruthy();
    expect(request.callbackIntents).not.toContain('PAYMENT_METHOD');
    expect(request.callbackIntents).not.toContain('SHIPPING_OPTION');
    expect(request.callbackIntents).not.toContain('SHIPPING_ADDRESS');
    expect(request.callbackIntents).toContain('PAYMENT_AUTHORIZATION');

    testButton.unmount();
  });
});

describe('Google Pay client invalidation', () => {
  it('invalidates client when environment changes', async () => {
    const props1: Props = {
      ...defaults,
      environment: 'TEST',
    };
    const props2: Props = {
      ...defaults,
      environment: 'PRODUCTION',
    };
    const testButton = await createTestButton(props1);
    const button = testButton.component;

    const invalidated = button.isClientInvalidated(props1, props2);

    expect(invalidated).toBe(true);

    testButton.unmount();
  });

  it('invalidates client when existingPaymentMethodRequired changes', async () => {
    const props1: Props = {
      ...defaults,
      existingPaymentMethodRequired: false,
    };
    const props2: Props = {
      ...defaults,
      existingPaymentMethodRequired: true,
    };
    const testButton = await createTestButton(props1);
    const button = testButton.component;

    const invalidated = button.isClientInvalidated(props1, props2);

    expect(invalidated).toBe(true);

    testButton.unmount();
  });

  it('invalidates client when onPaymentDataChanged added', async () => {
    const props1: Props = {
      ...defaults,
    };
    const props2: Props = {
      ...defaults,
      onPaymentDataChanged: () => ({}),
    };
    const testButton = await createTestButton(props1);
    const button = testButton.component;

    const invalidated = button.isClientInvalidated(props1, props2);

    expect(invalidated).toBe(true);

    testButton.unmount();
  });

  it('invalidates client when onPaymentDataChanged removed', async () => {
    const props1: Props = {
      ...defaults,
      onPaymentDataChanged: () => ({}),
    };
    const props2: Props = {
      ...defaults,
    };
    const testButton = await createTestButton(props1);
    const button = testButton.component;

    const invalidated = button.isClientInvalidated(props1, props2);

    expect(invalidated).toBe(true);

    testButton.unmount();
  });

  it('invalidates client when onPaymentAuthorized added', async () => {
    const props1: Props = {
      ...defaults,
    };
    const props2: Props = {
      ...defaults,
      onPaymentAuthorized: () => ({ transactionState: 'SUCCESS' }),
    };
    const testButton = await createTestButton(props1);
    const button = testButton.component;

    const invalidated = button.isClientInvalidated(props1, props2);

    expect(invalidated).toBe(true);

    testButton.unmount();
  });

  it('invalidates client when onPaymentAuthorized removed', async () => {
    const props1: Props = {
      ...defaults,
      onPaymentAuthorized: () => ({ transactionState: 'SUCCESS' }),
    };
    const props2: Props = {
      ...defaults,
    };
    const testButton = await createTestButton(props1);
    const button = testButton.component;

    const invalidated = button.isClientInvalidated(props1, props2);

    expect(invalidated).toBe(true);

    testButton.unmount();
  });

  it('does not invalidate client when onPaymentAuthorized modified', async () => {
    const props1: Props = {
      ...defaults,
      onPaymentAuthorized: () => ({ transactionState: 'SUCCESS' }),
    };
    const props2: Props = {
      ...defaults,
      onPaymentAuthorized: () => ({ transactionState: 'ERROR' }),
    };
    const testButton = await createTestButton(props1);
    const button = testButton.component;

    const invalidated = button.isClientInvalidated(props1, props2);

    expect(invalidated).toBe(false);

    testButton.unmount();
  });

  it('does not invalidate client transactionInfoChannges', async () => {
    const props1: Props = {
      ...defaults,
    };
    const props2: Props = {
      ...defaults,
      paymentRequest: {
        ...defaults.paymentRequest,
        transactionInfo: {
          ...defaults.paymentRequest.transactionInfo,
          totalPrice: '200.00',
        },
      },
    };
    const testButton = await createTestButton(props1);
    const button = testButton.component;

    const invalidated = button.isClientInvalidated(props1, props2);

    expect(invalidated).toBe(false);

    testButton.unmount();
  });

  it('invalidates client when buttonType changes', async () => {
    const props1: Props = {
      ...defaults,
      buttonType: 'long',
    };
    const props2: Props = {
      ...defaults,
      buttonType: 'short',
    };
    const testButton = await createTestButton(props1);
    const button = testButton.component;

    const invalidated = button.isClientInvalidated(props1, props2);

    expect(invalidated).toBe(true);

    testButton.unmount();
  });

  it('invalidates client when buttonColor changes', async () => {
    const props1: Props = {
      ...defaults,
      buttonColor: 'default',
    };
    const props2: Props = {
      ...defaults,
      buttonColor: 'white',
    };
    const testButton = await createTestButton(props1);
    const button = testButton.component;

    const invalidated = button.isClientInvalidated(props1, props2);

    expect(invalidated).toBe(true);

    testButton.unmount();
  });
});