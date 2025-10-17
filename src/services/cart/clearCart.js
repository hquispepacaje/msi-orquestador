const axios = require('axios');
const { commerceCredentials } = require('../utils');

async function clearCart(cartToken) {
    if (!cartToken) {
        throw new Error("Se requiere un 'cart-token' para vaciar el carrito.");
    }

    const { apiUrl } = commerceCredentials;
    const url = `${apiUrl}/wp-json/wc/store/v1/cart/items`;

    try {
        await axios.delete(url, {
            headers: {
                'cart-token': cartToken
            }
        });
    } catch (error) {
        throw new Error(`Error de conexión al vaciar el carrito: ${error.message}`);
    }
}

module.exports = { clearCart };