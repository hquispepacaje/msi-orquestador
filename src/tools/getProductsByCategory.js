const { getProductsByCategory: fetchProductsByCategory } = require('../services/products/getProductsByCategory');
const { getCompletion } = require('../utils/clientHelpers');
const {
    getProductsPrompt,
    getProductsToolDescriptionPrompt,
    getCategoryNamePrompt,
    dontFoundCategoryPrompt,
} = require('../prompts/getProductsByCategoryPrompts');
const { getCategories } = require('../services/category/getCategories');

const getProducts = async (categoryID) => {
    return await fetchProductsByCategory(categoryID);
};

const getProductsByCategoryTool = {
    type: "function",
    function: {
        name: "getProductsByCategoryTool",
        description: getProductsToolDescriptionPrompt,
        parameters: {
            type: "object",
            properties: {
                categoryName: {
                    type: "string",
                    description: getCategoryNamePrompt,
                },
            },
            required: ['categoryName'],
        },
    },
};

const getProductsByCategoryToolImplementation = async (client, messages, responseMessage) => {
    const toolCall = responseMessage.tool_calls[0];
    const toolName = toolCall?.function?.name;
    const toolID = toolCall?.id;
    const toolArgs = JSON.parse(toolCall?.function?.arguments);
    const categoryName = toolArgs?.categoryName || null;

    const historyMessages = [...messages];

    const categories = await getCategories();

    const categoryFound = categories.find(category => category.name.toLowerCase() === categoryName.toLowerCase());

    if (categoryFound) {
        const productsResult = await getProducts(categoryFound.id);
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
    } else {
        historyMessages.push(
            {
                "role": "system",
                "content": dontFoundCategoryPrompt,
            }
        );
        historyMessages.push(responseMessage);
        historyMessages.push({
            tool_call_id: toolID,
            role: "tool",
            name: toolName,
            content: JSON.stringify(categories),
        });
    }

    const completion = await getCompletion(client, historyMessages);
    const responseMessageContent = completion.choices[0].message.content.trim();
    historyMessages.push({ role: "assistant", content: responseMessageContent });

    return {
        historyMessages,
        responseMessageContent,
    };
};

module.exports = { getProductsByCategoryTool, getProductsByCategoryToolImplementation };
