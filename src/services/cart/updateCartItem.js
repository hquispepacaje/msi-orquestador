const axios = require('axios');
const { commerceCredentials } = require('../utils');

async function updateCartItem(cartToken, itemKey, quantity) {
    if (!cartToken || !itemKey || quantity === undefined) {
        throw new Error("Se requiere un 'cart-token', 'itemKey' y 'quantity' para actualizar un item.");
    }

    const { apiUrl } = commerceCredentials;
    const url = `${apiUrl}/wp-json/wc/store/v1/cart/update-item`;

    try {
        const response = await axios.post(url, {}, {
            headers: {
                'cart-token': cartToken
            },
            params: {
                key: itemKey,
                quantity: quantity
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
        throw new Error(`Error de conexión al actualizar item del carrito: ${error.message}`);
    }
}

module.exports = { updateCartItem };
