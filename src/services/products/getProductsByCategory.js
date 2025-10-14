const axios = require('axios');
const { getCommerceCredentials } = require('../utils');

async function getProductsByCategory(categoryId) {
    const { customerKey, customerSecret, apiUrl } = getCommerceCredentials;

    const url = `${apiUrl}/wp-json/wc/v3/products?category=${categoryId}`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: customerKey,
                password: customerSecret
            }
        });
        const products = response?.data?.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            shortDescription: product.short_description,
            regularPrice: product.regular_price,
            salePrice: product.sale_price,
            images: product.images.map(img => img.src),
        }));
        return products;
    } catch (error) {
        throw new Error(`Error al obtener productos: ${error.message}`);
    }
}

module.exports = { getProductsByCategory };