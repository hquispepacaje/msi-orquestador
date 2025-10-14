const { getProducts: fetchProducts } = require('../services/products/getProducts');
const { getCompletion } = require('../utils/clientHelpers');
const {
    getProductsPrompt,
    getProductsToolDescriptionPrompt,
    getCategoryNamePrompt,
} = require('../prompts/getProductsPrompts');

const getProducts = async (categoryName) => {
    if (categoryName) {
        // Aquí podrías implementar la lógica para obtener productos por categoría si es necesario
        // Por ahora, simplemente llamamos a fetchProducts sin filtrar por categoría
    }
    return await fetchProducts();
};

const getProductsTool = {
    type: "function",
    function: {
        name: "getProductsTool",
        description: getProductsToolDescriptionPrompt,
        parameters: {
            type: "object",
            properties: {
                categoryName: {
                    type: "string",
                    description: getCategoryNamePrompt,
                },
            },
            required: [],
        },
    },
};

const getProductsToolImplementation = async (client, messages, toolCall, responseMessage) => {
    const toolName = toolCall?.function?.name;
    const toolID = toolCall?.id;
    const toolArgs = JSON.parse(toolCall?.function?.arguments);
    const categoryName = toolArgs?.categoryName || null;

    const _messages = [...messages];

    const productsResult = await getProducts(categoryName);

    _messages.push(
        {
            "role": "system",
            "content": getProductsPrompt,
        }
    );
    _messages.push(responseMessage);
    _messages.push({
        tool_call_id: toolID,
        role: "tool",
        name: toolName,
        content: JSON.stringify(productsResult),
    });

    const completion = await getCompletion(client, _messages);
    const respuestaBot = categoryName ? categoryName : completion.choices[0].message.content.trim();
    return respuestaBot;
};

module.exports = { getProductsTool, getProductsToolImplementation };
