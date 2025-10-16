const axios = require('axios');
const { commerceCredentials } = require('../utils');

async function getProducts() {
    const { customerKey, customerSecret, apiUrl } = commerceCredentials;

    const url = `${apiUrl}/wp-json/wc/v3/products`;

    let allProducts = [];
    let page = 1;
    const perPage = 100;

    try {
        while (true) {
            const response = await axios.get(url, {
                auth: {
                    username: customerKey,
                    password: customerSecret
                },
                params: {
                    per_page: perPage,
                    page: page
                }
            });
            if (response.data.length === 0) {
                break;
            }
            allProducts = allProducts.concat(response.data);
            page++;
        }
        const products = allProducts?.map(product => ({
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

module.exports = { getProducts };
