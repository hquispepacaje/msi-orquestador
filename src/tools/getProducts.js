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

    const historyMessages = [...messages];

    const productsResult = await getProducts();

    historyMessages.push(
        {
            "role": "system",
            "content": getProductsPrompt,
        }
    );
    historyMessages.push(responseMessage);
    historyMessages.push({
        tool_call_id: toolID,
        role: "tool",
        name: toolName,
        content: JSON.stringify(productsResult),
    });

    const completion = await getCompletion(client, historyMessages);
    const responseMessageContent = completion.choices[0].message.content.trim();
    historyMessages.push({ role: "assistant", content: responseMessageContent });

    return {
        historyMessages,
        responseMessageContent,
    };
};

module.exports = { getProductsTool, getProductsToolImplementation };
