const { app } = require('@azure/functions');
const axios = require('axios');
const { AzureOpenAI } = require('openai');
const { getProductsTool, getProductsToolImplementation } = require('../tools/getProducts'); 
const { mainPrompt } = require('../prompts/main');
const { getCompletionWithTools } = require('../utils/clientHelpers');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

const options = { endpoint, apiKey, deployment, apiVersion }
const client = new AzureOpenAI(options);

const tools = [getProductsTool];

app.http('telegramWebhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {   
        let update;
        try {
            update = await request.json();
        } catch (error) {
            context.error("Error al parsear el JSON del Webhook:", error);
            return { status: 400, body: "Solicitud inválida" };
        }

        if (!update || !update.message || !update.message.text) {
            return { status: 200, body: "No es un mensaje de chat." };
        }

        const chatId = update.message.chat.id;
        const textoUsuario = update.message.text || '';

        let respuestaBot = 'Lo siento, no entendí tu mensaje.';
        const messages = [
            {"role": "system", "content": mainPrompt},
            {"role": "user", "content": textoUsuario}
        ];

        try {
            const completion = await getCompletionWithTools(client, messages, tools);
            
            let responseMessage = completion.choices[0].message;

            if (responseMessage.tool_calls) {
                const toolCall = responseMessage.tool_calls[0];

                switch (toolCall?.function?.name) {
                    case 'getProductsTool':
                        respuestaBot = await getProductsToolImplementation(client, messages, toolCall, responseMessage);
                        break;
                    default:
                        break;
                }
            } else {
                respuestaBot = completion.choices[0].message.content.trim();
            }
        } catch (error) {
            respuestaBot = error.message;
        }

        try {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: chatId,
                text: respuestaBot
            });
            context.log(`Respuesta enviada a chat ID: ${chatId}`);

            return { status: 200 }; 
        } catch (error) {
            context.error("Error al enviar mensaje a Telegram:", error.message);
            return { status: 500 }; 
        }
    }
});