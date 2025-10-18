const { AzureOpenAI } = require('openai');
const { mainPrompt } = require('../prompts/main');
const { getCompletionWithTools } = require('../utils/clientHelpers');
const { getProductsByCategoryToolImplementation, getProductsByCategoryTool } = require('../tools/getProductsByCategory');
const { saveChatHistory, loadChatHistory } = require('../services/memory/memory');
const { getProductTool, getProductToolImplementation } = require('../tools/getProduct');
const { getCartToolImplementation, getCartTool } = require('../tools/getCart');
const { clearCartToolImplementation, clearCartTool } = require('../tools/clearCart');
const { addCartItemToolImplementation, addCartItemTool } = require('../tools/addCartItem');
const { addAddressDataToolImplementation, addAddressDataTool } = require('../tools/addAddressData');
const { createOrderToolImplementation, createOrderTool } = require('../tools/createOrder');

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

const options = { endpoint, apiKey, deployment, apiVersion }
const client = new AzureOpenAI(options);

const tools = [
    getProductsByCategoryTool,
    getProductTool,
    getCartTool,
    clearCartTool,
    addCartItemTool,
    addAddressDataTool,
    createOrderTool,
];

const getAgentResponse = async (userText, chatID) => {
    let botResponse = {
        historyMessages: [],
        responseMessageContent: 'Lo siento, no entendí tu mensaje.',
    };

    try {
        const history = await loadChatHistory(chatID);
        const messages = [
            {"role": "system", "content": mainPrompt},
            ...history,
            {"role": "user", "content": userText}
        ];
        const completion = await getCompletionWithTools(client, messages, tools);
        
        let responseMessage = completion.choices[0].message;

        if (responseMessage.tool_calls) {
            switch (responseMessage.tool_calls[0]?.function?.name) {
                case 'getProductsByCategoryTool':
                    botResponse = await getProductsByCategoryToolImplementation(client, messages, responseMessage);
                    break;
                case 'getProductTool':
                    botResponse = await getProductToolImplementation(client, messages, responseMessage);
                    break;
                case 'getCartTool':
                    botResponse = await getCartToolImplementation(client, messages, responseMessage, chatID);
                    break;
                case 'clearCartTool':
                    botResponse = await clearCartToolImplementation(client, messages, responseMessage, chatID);
                    break;
                case 'addCartItemTool':
                    botResponse = await addCartItemToolImplementation(client, messages, responseMessage, chatID);
                    break;
                case 'addAddressDataTool':
                    botResponse = await addAddressDataToolImplementation(client, messages, responseMessage, chatID);
                    break;
                case 'createOrderTool':
                    botResponse = await createOrderToolImplementation(client, messages, responseMessage, chatID);
                    break;
                default:
                    break;
            }
        } else {
            const responseMessageContent = responseMessage.content.trim();
            messages.push({ role: "assistant", content: responseMessageContent });
            botResponse = {
                historyMessages: messages,
                responseMessageContent,
            };
        }
        await saveChatHistory(chatID, botResponse.historyMessages);
        return botResponse.responseMessageContent;
    } catch (error) {
        return error.message;
    }
};

module.exports = { getAgentResponse };
