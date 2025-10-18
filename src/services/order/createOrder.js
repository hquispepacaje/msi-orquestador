const axios = require('axios');
const { commerceCredentials } = require('../utils');

async function createOrder(cartToken, clientAddressData) {
    if (!cartToken) {
        throw new Error("Se requiere un 'cartToken' para proceder con el checkout.");
    }
    if (!checkoutData) {
        throw new Error("Se requiere la información de checkout.");
    }

    const { apiUrl } = commerceCredentials;
    const url = `${apiUrl}/wp-json/wc/store/v1/checkout`;
    
    const {
        firstName,
        lastName,
        address,
        city,
        state,
        email,
        phone,
    } = clientAddressData;

    const checkoutData = {
        "billing_address": {
            "first_name": firstName,
            "last_name": lastName,
            "company": '',
            "address_1": address,
            "address_2": state + ' / ' + city,
            "city": 'Arica',
            "state": 'Arica',
            "postcode": '1000000',
            "country": 'CL',
            "email": email,
            "phone": phone
        },
        "shipping_address": {
            "first_name": firstName,
            "last_name": lastName,
            "company": '',
            "address_1": address,
            "address_2": state + ' / ' + city,
            "city": 'Arica',
            "state": 'Arica',
            "postcode": '1000000',
            "country": 'CL',
            "email": email,
            "phone": phone
        },
        "customer_note": '',
        "create_account": false,
        "payment_method": "transbank_webpay_plus_rest",
        "payment_data": []
    };

    try {
        const response = await axios.post(url, checkoutData, {
            headers: {
                'Content-Type': 'application/json',
                'cart-token': cartToken
            }
        });

        const orderData = response.data;

        const formattedOrder = {
            orderID: orderData.order_id,
            orderKey: orderData.order_key,
            paymentUrl: orderData.payment_result.redirect_url,
        };

        return formattedOrder;

    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Error de conexión al crear la orden: ${errorMessage}`);
    }
}

module.exports = { createOrder };