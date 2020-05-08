# Google Pay React Component

This is the React component for the Google Pay Button.

## Installation

```sh
npm install --save react-google-pay-button
```

## Example Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import GooglePayButton from 'react-google-pay-button';

const App = () => (
  <GooglePayButton
    paymentRequest={{
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'gateway name',
            },
          },
        },
      ],
      merchantInfo: {
        merchantId: '12345678901234567890',
        merchantName: 'Demo Merchant',
      },
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: '100.00',
        currencyCode: 'USD',
        countryCode: 'US',
      },
    }}
    onLoadPaymentData={paymentRequest => {
      console.log('Success', paymentRequest);
    }}
  />
);

ReactDOM.render(<App />, document.getElementById('root'));
```

More examples can be found in the [examples folder](./examples/src/examples) of this repository.

## Documentation

Visit the [Google Pay developer site](https://developers.google.com/pay/api/web/overview) for more information.

### Properties

<table>
  <tr>
    <th align="left">Property</th>
    <th align="left">Type</th>
    <th align="left">Remarks</th>
  </tr>
  <tr>
    <td><p>buttonColor</p></td>
    <td><p><code>"default" | "black" | "white"</code></p></td>
    <td>
      <p>Optional.</p>
      <p>Default value <code>"default"</code>.</p>
    </td>
  </tr>
  <tr>
    <td><p>buttonType</p></td>
    <td><p><code>"short" | "long"</code></p></td>
    <td>
      <p>Optional.</p>
      <p>Default value <code>"long"</code>.</p>
    </td>
  </tr>
  <tr>
    <td><p>className</p></td>
    <td><p><code>string</code></p></td>
    <td>
      <p>Optional.</p>
      <p>The CSS class name to apply to the element.</p>
    </td>
  </tr>
  <tr>
    <td><p>environment</p></td>
    <td><p><code>"TEST" | "PRODUCTION"</code></p></td>
    <td>
      <p>Optional.</p>
      <p>Default value <code>"TEST"</code>.</p>
    </td>
  </tr>
  <tr>
    <td><p>existingPaymentMethodRequired</p></td>
    <td><p><code>boolean</code></p></td>
    <td>
      <p>Optional.</p>
      <p>Default value <code>false</code>.</p>
    </td>
  </tr>
  <tr>
    <td><p>paymentRequest</p></td>
    <td><p><a href="https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest"><code>PaymentDataRequest</code></a></p></td>
    <td>
      <p>Required.</p>
      <p>Request parameters that define the type of payment information requested from Google Pay.</p>
      <p>See <a href="https://developers.google.com/pay/api/web/reference/request-objects#PaymentDataRequest"><code>PaymentDataRequest</code> reference</a> for more information.</p>
    </td>
  </tr>
  <tr>
    <td><p>style</p></td>
    <td><p><code>CSSProperties</code></p></td>
    <td>
      <p>Optional.</p>
      <p>The CSS style attributes to apply to the element.</p>
      <p>Note: to customize the width or heifht of the Google Pay button, the <code>fill</code> class should be included in <code>className</code>.</p>
    </td>
  </tr>
</table>

### Callbacks

<table>
  <tr>
    <th align="left">Callback</th>
    <th align="left">Remarks</th>
  </tr>
  <tr>
    <td><p>onCancel</p></td>
    <td>
      <p>Invoked when a user cancels or closes the Google Pay payment sheet.</p>
    </td>
  </tr>
  <tr>
    <td><p>onError</p></td>
    <td>
      <p>Invoked an error is encountered in the process of presenting and collecting payment options from the Google Pay payment sheet.</p>
    </td>
  </tr>
  <tr>
    <td><p>onReadyToPayChange</p></td>
    <td>
      <p>Invoked when the user's <code>isReadyToPay</code> state changes. This callback can be used to change the application's behaviour based on whether or not the user is ready to pay.</p>
    </td>
  </tr>
  <tr>
    <td><p>onPaymentAuthorized</p></td>
    <td>
      <p>Invoked when a user chooses a payment method. This callback should be used to validate whether or not the payment method can be used to complete a payment.</p>
      <p>This would be typically used to perform pre-authorization to ensure that the card is valid and has sufficient funds.</p>
      <p>See <a href="https://developers.google.com/pay/api/web/reference/client#onPaymentAuthorized">payment authorization reference</a> for more information.</p>
    </td>
  </tr>
  <tr>
    <td><p>onPaymentDataChanged</p></td>
    <td>
      <p>Invoked when payment the user changes payment data options including payment method, shipping details, and contact details. This callback can be used to dynamically update `transactionInfo` when payment details, shipping address, or shipping options change.</p>
      <p>See <a href="https://developers.google.com/pay/api/web/reference/client#onPaymentDataChanged">payment data changed reference</a> for more information.</p>
    </td>
  </tr>
  <tr>
    <td><p>onLoadPaymentData</p></td>
    <td>
      <p>Invoked when a user has successfully nominated payment details.</p>
    </td>
  </tr>
</table>