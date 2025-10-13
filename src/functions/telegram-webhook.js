const { app } = require("@azure/functions");
const axios = require("axios");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

app.http('telegramWebhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {   
        context.log('--- Mensaje de Telegram Recibido ---');

        let update;
        try {
            update = await request.json();
        } catch (error) {
            context.log.error("Error al parsear el JSON del Webhook:", error);
            return { status: 400, body: "Solicitud inválida" };
        }

        if (!update || !update.message) {
            return { status: 200, body: "No es un mensaje de chat, ignorando." };
        }

        const chatId = update.message.chat.id;
        const textoUsuario = update.message.text || '';
        
        context.log(`Chat ID: ${chatId}, Mensaje: "${textoUsuario}"`);

        let respuestaBot;
        if (textoUsuario.toLowerCase().includes('hola')) {
            respuestaBot = "¡Hola! Soy tu Azure Function Bot. ¿En qué puedo ayudarte?";
        } else if (textoUsuario.toLowerCase().includes('adios')) {
            respuestaBot = "¡Hasta luego! Vuelve pronto.";
        } else {
            respuestaBot = `Recibí tu mensaje: "${textoUsuario}". ¡Gracias por escribir!`;
        }

        try {
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: chatId,
                text: respuestaBot
            });
            context.log(`Respuesta enviada a chat ID: ${chatId}`);

            return { status: 200 }; 
            
        } catch (error) {
            context.log.error("Error al enviar mensaje a Telegram:", error.message);
            return { status: 500 }; 
        }
    }
});