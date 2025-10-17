const { getCompletion } = require('../utils/clientHelpers');
const {
    getCartPrompt,
    cartDontFoundPrompt,
    getCartToolDescriptionPrompt,
} = require('../prompts/getCartPrompts');
const { getCart } = require('../services/cart/getCart');
const { getCartToken, saveCartToken, deleteCartToken } = require('../services/cart/cartToken');

const getCartTool = {
    type: "function",
    function: {
        name: "getCartTool",
        description: getCartToolDescriptionPrompt,
        parameters: {},
    },
};

const getCartToolImplementation = async (client, messages, responseMessage, chatID) => {
    const toolCall = responseMessage.tool_calls[0];
    const toolName = toolCall?.function?.name;
    const toolID = toolCall?.id;

    const historyMessages = [...messages];

    const cartToken = await getCartToken(chatID); 
    if (!cartToken) {
        historyMessages.push(responseMessage);
        historyMessages.push({
            tool_call_id: toolID,
            role: "tool",
            name: toolName,
            content: cartDontFoundPrompt,
        });
        const completion = await getCompletion(client, historyMessages);
        const responseMessageContent = completion.choices[0].message.content.trim();

        historyMessages.push({ role: "assistant", content: responseMessageContent });

        return {
            historyMessages,
            responseMessageContent,
        };
    }

    const {cart, newCartToken} = await getCart(cartToken);

    historyMessages.push(
        {
            "role": "system",
            "content": getCartPrompt,
        }
    );
    historyMessages.push(responseMessage);
    historyMessages.push({
        tool_call_id: toolID,
        role: "tool",
        name: toolName,
        content: JSON.stringify(cart),
    });

    const completion = await getCompletion(client, historyMessages);
    const responseMessageContent = completion.choices[0].message.content.trim();
    historyMessages.push({ role: "assistant", content: responseMessageContent });
    
    await saveCartToken(chatID, newCartToken);

    return {
        historyMessages,
        responseMessageContent,
    };
};

module.exports = { getCartTool, getCartToolImplementation };
