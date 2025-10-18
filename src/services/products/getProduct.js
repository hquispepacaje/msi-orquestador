const axios = require('axios');
const { commerceCredentials } = require('../utils');

async function getProduct(productID) {
    if (!productID) {
        throw new Error("Se requiere un ID de producto.");
    }

    const { customerKey, customerSecret, apiUrl } = commerceCredentials;

    const url = `${apiUrl}/wp-json/wc/v3/products/${productID}`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: customerKey,
                password: customerSecret
            }
        });

        const productData = response.data;

        if (!productData) {
            return null;
        }

        const formattedProduct = {
            id: productData.id,
            name: productData.name,
            description: productData.description,
            shortDescription: productData.short_description,
            regularPrice: productData.regular_price,
            salePrice: productData.sale_price,
            images: productData.images.map(img => img.src),
        };

        return formattedProduct;

    } catch (error) {
        throw new Error(`Error al obtener el producto con ID ${productID}: ${error.message}`);
    }
}

module.exports = { getProduct };
