const { app } = require("@azure/functions");
const axios = require("axios");
const { OpenAI } = require("openai");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`
});

app.http('telegramWebhook', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {   
        let update;
        try {
            update = await request.json();
        } catch (error) {
            context.log.error("Error al parsear el JSON del Webhook:", error);
            return { status: 400, body: "Solicitud inválida" };
        }

        if (!update || !update.message || !update.message.text) {
            return { status: 200, body: "No es un mensaje de chat." };
        }

        const chatId = update.message.chat.id;
        const textoUsuario = update.message.text || '';

        let respuestaBot;
    
         try {
            const completion = await openai.chat.completions.create({
                model: process.env.AZURE_OPENAI_DEPLOYMENT,
                messages: [
                    {"role": "system", "content": "Eres un útil asistente de chatbot para estudiantes. Tus respuestas deben ser concisas y amigables."},
                    {"role": "user", "content": textoUsuario}
                ],
                temperature: 0.7,
                max_tokens: 1000
            });
            
            respuestaBot = completion.choices[0].message.content.trim();
            
        } catch (error) {
            context.log.error("Error al llamar a Azure OpenAI:", error.message);
            respuestaBot = "Lo siento, tuve un problema al conectarme con la IA. Por favor, revisa mi configuración.";
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