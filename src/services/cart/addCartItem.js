const axios = require('axios');
const { commerceCredentials } = require('../utils');

async function addCartItem(cartToken, productId, quantity = 1) {
    if (!productId) {
        throw new Error("Se requiere un 'productId' para agregar un item.");
    }

    const { apiUrl } = commerceCredentials;
    const url = `${apiUrl}/wp-json/wc/store/v1/cart/add-item`;

    const payload = {
        id: productId,
        quantity: quantity
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'cart-token': cartToken
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
        throw new Error(`Error de conexión al agregar al carrito: ${error.message}`);
    }
}

module.exports = { addCartItem };
