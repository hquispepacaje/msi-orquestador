const axios = require('axios');
const { commerceCredentials } = require('../utils');

async function getCategories() {
    const { customerKey, customerSecret, apiUrl } = commerceCredentials;

    const url = `${apiUrl}/wp-json/wc/v3/products/categories`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: customerKey,
                password: customerSecret
            }
        });
        const categories = response?.data?.map(category => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
        }));

        return categories;
    } catch (error) {
        throw new Error(`Error al obtener categorias: ${error.message}`);
    }
}

module.exports = { getCategories };