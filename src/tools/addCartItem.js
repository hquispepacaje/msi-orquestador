const { getCompletion } = require('../utils/clientHelpers');
const {
    addCartItemPrompt,
    addCartItemToolDescriptionPrompt,
    getProductIDPrompt,
    getQuantityPrompt,
} = require('../prompts/addCartItemPrompts');
const { addCartItem } = require('../services/cart/addCartItem');
const { getCartToken, saveCartToken } = require('../services/cart/cartToken');
const { getCart } = require('../services/cart/getCart');

const addCartItemTool = {
    type: "function",
    function: {
        name: "addCartItemTool",
        description: addCartItemToolDescriptionPrompt,
        parameters: {
            type: "object",
            properties: {
                productID: {
                    type: "string",
                    description: getProductIDPrompt,
                },
                quantity: {
                    type: "number",
                    description: getQuantityPrompt,
                },
            },
            required: ['productID'],
        },
    },
};

const addCartItemToolImplementation = async (client, messages, responseMessage, chatID) => {
    const toolCall = responseMessage.tool_calls[0];
    const toolName = toolCall?.function?.name;
    const toolID = toolCall?.id;
    const toolArgs = JSON.parse(toolCall?.function?.arguments);
    const productID = toolArgs?.productID || null;
    const quantity = toolArgs?.quantity || 1;

    const historyMessages = [...messages];

    let cartToken = await getCartToken(chatID); 
    if (!cartToken) {
        const { newCartToken: _cartToken } = await getCart('');
        cartToken = _cartToken;
    }
    const {cart, newCartToken} = await addCartItem(cartToken, productID, quantity);

    historyMessages.push(
        {
            "role": "system",
            "content": addCartItemPrompt,
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

module.exports = { addCartItemTool, addCartItemToolImplementation };
