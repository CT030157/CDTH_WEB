import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

export default class Paypal extends React.Component {
    render() {
        const onSuccess = (payment) => {
            console.log("The payment was succeeded!", payment);
            this.props.onSuccess(payment);
        
        }

        const onCancel = (data) => {
            console.log('The payment was cancelled!', data);
        }

        const onError = (err) => {
            console.log("Error!", err);
        }

        let env = 'sandbox';
        let currency = 'USD';
        let total = this.props.toPay;

        const client = {
            sandbox: 'AelMA7rUdxce2INjEX1y9KQ47L4J8Idv7rIROe3if2vnMqsIkIz5FFUvA5g-cZiRCnRl3X2EAZljDxWw',
            production: 'YOUR-PRODUCTION-APP-ID',
        }
        return (
            <PaypalExpressBtn
                env={env}
                client={client}
                currency={currency}
                total={total}
                onError={onError}
                onSuccess={onSuccess}
                onCancel={onCancel}
                style={{ 
                    size:'large',
                    color:'blue',
                    shape: 'rect',
                    label: 'checkout'
                }}
                 />
        );
    }
}