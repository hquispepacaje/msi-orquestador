const { getProducts: fetchProducts } = require('../services/products/getProducts');
const { getCompletion } = require('../utils/clientHelpers');
const {
    getProductsPrompt,
    getProductsToolDescriptionPrompt,
} = require('../prompts/getProductsPrompts');

const getProducts = async () => {
    return await fetchProducts();
};

const getProductsTool = {
    type: "function",
    function: {
        name: "getProductsTool",
        description: getProductsToolDescriptionPrompt,
        parameters: {},
    },
};

const getProductsToolImplementation = async (client, messages, responseMessage) => {
    const toolCall = responseMessage.tool_calls[0];
    const toolName = toolCall?.function?.name;
    const toolID = toolCall?.id;

    const _messages = [...messages];

    const productsResult = await getProducts();

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
    const respuestaBot = completion.choices[0].message.content.trim();
    return respuestaBot;
};

module.exports = { getProductsTool, getProductsToolImplementation };
