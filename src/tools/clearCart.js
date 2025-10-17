const { getCompletion } = require('../utils/clientHelpers');
const {
    clearCartPrompt,
    cartDontFoundPrompt,
    clearCartToolDescriptionPrompt,
} = require('../prompts/clearCartPrompts');
const { clearCart } = require('../services/cart/clearCart');
const { getCartToken, deleteCartToken } = require('../services/cart/cartToken');

const clearCartTool = {
    type: "function",
    function: {
        name: "clearCartTool",
        description: clearCartToolDescriptionPrompt,
        parameters: {},
    },
};

const clearCartToolImplementation = async (client, messages, responseMessage, chatID) => {
    const toolCall = responseMessage.tool_calls[0];
    const toolName = toolCall?.function?.name;
    const toolID = toolCall?.id;

    const historyMessages = [...messages];

    const cartToken = await getCartToken(chatID); 
    if (!cartToken) {
        historyMessages.push(
            {
                "role": "system",
                "content": cartDontFoundPrompt,
            }
        );
        historyMessages.push(responseMessage);

        const completion = await getCompletion(client, historyMessages);
        const responseMessageContent = completion.choices[0].message.content.trim();

        historyMessages.push({ role: "assistant", content: responseMessageContent });

        return {
            historyMessages,
            responseMessageContent,
        };
    }

    await clearCart(cartToken);

    historyMessages.push(
        {
            "role": "system",
            "content": clearCartPrompt,
        }
    );
    historyMessages.push(responseMessage);

    const completion = await getCompletion(client, historyMessages);
    const responseMessageContent = completion.choices[0].message.content.trim();
    historyMessages.push({ role: "assistant", content: responseMessageContent });
    
    await deleteCartToken(chatID);

    return {
        historyMessages,
        responseMessageContent,
    };
};

module.exports = { clearCartTool, clearCartToolImplementation };
