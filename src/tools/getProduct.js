const { getCompletion } = require('../utils/clientHelpers');
const {
    getProductPrompt,
    getProductToolDescriptionPrompt,
    getProductIDPrompt,
} = require('../prompts/getProductPrompts');
const { getProduct } = require('../services/products/getProduct');

const getProductTool = {
    type: "function",
    function: {
        name: "getProductTool",
        description: getProductToolDescriptionPrompt,
        parameters: {
            type: "object",
            properties: {
                productID: {
                    type: "string",
                    description: getProductIDPrompt,
                },
            },
            required: ['productID'],
        },
    },
};

const getProductToolImplementation = async (client, messages, responseMessage) => {
    const toolCall = responseMessage.tool_calls[0];
    const toolName = toolCall?.function?.name;
    const toolID = toolCall?.id;
    const toolArgs = JSON.parse(toolCall?.function?.arguments);
    const productID = toolArgs?.productID || null;

    const historyMessages = [...messages];

    const productResult = await getProduct(productID);

    historyMessages.push(
        {
            "role": "system",
            "content": getProductPrompt,
        }
    );
    historyMessages.push(responseMessage);
    historyMessages.push({
        tool_call_id: toolID,
        role: "tool",
        name: toolName,
        content: JSON.stringify(productResult),
    });

    const completion = await getCompletion(client, historyMessages);
    const responseMessageContent = completion.choices[0].message.content.trim();
    historyMessages.push({ role: "assistant", content: responseMessageContent });

    return {
        historyMessages,
        responseMessageContent,
    };
};

module.exports = { getProductTool, getProductToolImplementation };
