const { app } = require("@azure/functions");
const axios = require("axios");
const { AzureOpenAI } = require("openai");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; 
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const modelName = process.env.AZURE_OPENAI_DEPLOYMENT;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

const options = { endpoint, apiKey, deployment, apiVersion }
const client = new AzureOpenAI(options);

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

        let respuestaBot;
    
         try {
            const completion = await client.chat.completions.create({
                model: modelName,
                messages: [
                    {"role": "system", "content": "Eres un útil asistente de chatbot para estudiantes. Tus respuestas deben ser concisas y amigables."},
                    {"role": "user", "content": textoUsuario}
                ],
                max_completion_tokens: 13107,
                temperature: 1,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            
            respuestaBot = completion.choices[0].message.content.trim();
            
        } catch (error) {
            context.error("Error al llamar a Azure OpenAI:", error.message);
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
            context.error("Error al enviar mensaje a Telegram:", error.message);
            return { status: 500 }; 
        }
    }
});