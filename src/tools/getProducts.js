const { getProducts: fetchProducts } = require('../services/products/getProducts');

const getProducts = async () => {
    return await fetchProducts();
};

const getProductsTool = {
    type: "function",
    function: {
        name: "getProductsTool",
        description: "Útil cuando el usuario pregunta por productos disponibles.",
        parameters: {},
    },
};

module.exports = { getProductsTool, getProducts };
