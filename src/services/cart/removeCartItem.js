const axios = require('axios');
const { commerceCredentials } = require('../utils');

async function removeCartItem(cartToken, itemKey) {
    if (!cartToken || !itemKey) {
        throw new Error("Se requiere un 'cart-token' y un 'itemKey' para eliminar un item.");
    }

    const { apiUrl } = commerceCredentials;
    const url = `${apiUrl}/wp-json/wc/store/v1/cart/remove-item`;

    try {
        const response = await axios.post(url, {}, {
            headers: {
                'cart-token': cartToken
            },
            params: {
                key: itemKey
            }
        });

        const cartData = response.data;
        const newCartToken = response.headers['cart-token'];

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
        throw new Error(`Error de conexión al eliminar item del carrito: ${error.message}`);
    }
}

module.exports = { removeCartItem };
