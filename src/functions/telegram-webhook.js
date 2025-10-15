const { app } = require('@azure/functions');
const axios = require('axios');
const { getAgentResponse } = require('../agent/agent');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

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

        const chatID = update.message.chat.id;
        const userText = update.message.text || '';

        const responseMessageContent = await getAgentResponse(userText, chatID);

        try {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: chatID,
                text: responseMessageContent
            });
            context.log(`Respuesta enviada a chat ID: ${chatID}`);

            return { status: 200 }; 
        } catch (error) {
            context.error("Error al enviar mensaje a Telegram:", error.message);
            return { status: 500 }; 
        }
    }
});