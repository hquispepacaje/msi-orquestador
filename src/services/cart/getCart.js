const axios = require('axios');
const { commerceCredentials } = require('../utils');

async function getCart(cartToken) {
    const { apiUrl } = commerceCredentials;
    const url = `${apiUrl}/wp-json/wc/store/v1/cart`;

    try {
        const response = await axios.get(url, {
            headers: {
                'cart-token': cartToken ?? '',
            }
        });

        const cartData = response.data;
        const newCartToken = response.headers['cart-token'];

        if (!cartData || cartData.items_count === 0) {
            return { cart: { items: [], totals: {} }, newCartToken };
        }

        const formattedCart = {
            itemCount: cartData.items_count,
            items: cartData.items.map(item => ({
                key: item.key,
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.prices.price,
                lineTotal: item.totals.line_total
            })),
            totals: {
                totalPrice: cartData.totals.total_price,
                currencyCode: cartData.totals.currency_code,
                currencySymbol: cartData.totals.currency_symbol,
            }
        };
        return { cart: formattedCart, newCartToken };

    } catch (error) {
        throw new Error(`Error de conexión al obtener el carrito: ${error.message}`);
    }
}

module.exports = { getCart };
