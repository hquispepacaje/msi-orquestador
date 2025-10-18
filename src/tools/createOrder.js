const { getCompletion } = require('../utils/clientHelpers');
const { getCartToken } = require('../services/cart/cartToken');
const { getClientAddress } = require('../services/checkout/clientAddress');
const { createOrder } = require('../services/order/createOrder');
const { createOrderToolDescriptionPrompt, billingAddressDontFoundPrompt, createOrderToolPrompt, cartDontFoundPrompt } = require('../prompts/createOrderPrompt');

const createOrderTool = {
    type: "function",
    function: {
        name: "createOrderTool",
        description: createOrderToolDescriptionPrompt,
        parameters: {},
    },
};

const createOrderToolImplementation = async (client, messages, responseMessage, chatID) => {
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

    const billingAddress = await getClientAddress(chatID); 

    if (!billingAddress) {
        historyMessages.push(responseMessage);
        historyMessages.push({
            tool_call_id: toolID,
            role: "tool",
            name: toolName,
            content: billingAddressDontFoundPrompt,
        });
        const completion = await getCompletion(client, historyMessages);
        const responseMessageContent = completion.choices[0].message.content.trim();

        historyMessages.push({ role: "assistant", content: responseMessageContent });

        return {
            historyMessages,
            responseMessageContent,
        };
    }

    const order = await createOrder(cartToken, billingAddress);

    historyMessages.push(
        {
            "role": "system",
            "content": createOrderToolPrompt,
        }
    );
    historyMessages.push(responseMessage);
    historyMessages.push({
        tool_call_id: toolID,
        role: "tool",
        name: toolName,
        content: JSON.stringify({ paymentUrl: order.paymentUrl }),
    });

    const completion = await getCompletion(client, historyMessages);
    const responseMessageContent = completion.choices[0].message.content.trim();
    historyMessages.push({ role: "assistant", content: responseMessageContent });
    
    return {
        historyMessages,
        responseMessageContent,
    };
};

module.exports = { createOrderTool, createOrderToolImplementation };
