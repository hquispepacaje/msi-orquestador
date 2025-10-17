const { AzureOpenAI } = require('openai');
const { getProductsTool, getProductsToolImplementation } = require('../tools/getProducts'); 
const { mainPrompt } = require('../prompts/main');
const { getCompletionWithTools } = require('../utils/clientHelpers');
const { getProductsByCategoryToolImplementation, getProductsByCategoryTool } = require('../tools/getProductsByCategory');
const { saveChatHistory, loadChatHistory } = require('../services/memory/memory');
const { getProductTool, getProductToolImplementation } = require('../tools/getProduct');
const { getCartToolImplementation } = require('../tools/getCart');
const { clearCartToolImplementation } = require('../tools/clearCart');
const { addCartItemToolImplementation } = require('../tools/addCartItem');

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

const options = { endpoint, apiKey, deployment, apiVersion }
const client = new AzureOpenAI(options);

const tools = [
    getProductsTool,
    getProductsByCategoryTool,
    getProductTool,
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
                case 'getProductsTool':
                    botResponse = await getProductsToolImplementation(client, messages, responseMessage);
                    break;
                case 'getProductTool':
                    botResponse = await getProductToolImplementation(client, messages, responseMessage);
                    break;
                case 'getCartTool':
                    botResponse = await getCartToolImplementation(client, messages, responseMessage);
                    break;
                case 'clearCartTool':
                    botResponse = await clearCartToolImplementation(client, messages, responseMessage);
                    break;
                case 'addCartItemTool':
                    botResponse = await addCartItemToolImplementation(client, messages, responseMessage);
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
