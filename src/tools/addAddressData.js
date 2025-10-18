const { getCompletion } = require('../utils/clientHelpers');
const { getCartToken } = require('../services/cart/cartToken');
const {
    addAddressDataToolDescriptionPrompt,
    getFirstNamePrompt,
    getLastNamePrompt,
    getAddressPrompt,
    getCityPrompt,
    getStatePrompt,
    getEmailPrompt,
    getPhonePrompt,
    requiredFieldsDontFound,
    addAddressDataPrompt,
    cartDontFoundPrompt,
} = require('../prompts/addAddressDataPrompts');
const { saveClientAddress } = require('../services/checkout/clientAddress');

const addAddressDataTool = {
    type: "function",
    function: {
        name: "addAddressDataTool",
        description: addAddressDataToolDescriptionPrompt,
        parameters: {
            type: "object",
            properties: {
                nombre: {
                    type: "string",
                    description: getFirstNamePrompt,
                },
                apellido: {
                    type: "string",
                    description: getLastNamePrompt,
                },
                direccion: {
                    type: "string",
                    description: getAddressPrompt,
                },
                ciudad: {
                    type: "string",
                    description: getCityPrompt,
                },
                region: {
                    type: "string",
                    description: getStatePrompt,
                },
                correo: {
                    type: "string",
                    description: getEmailPrompt,
                },
                telefono: {
                    type: "string",
                    description: getPhonePrompt,
                },
            },
            required: ['nombre', 'apellido', 'direccion', 'ciudad', 'region', 'correo', 'telefono'],
        },
    },
};

const addAddressDataToolImplementation = async (client, messages, responseMessage, chatID) => {
    const toolCall = responseMessage.tool_calls[0];
    const toolName = toolCall?.function?.name;
    const toolID = toolCall?.id;
    const toolArgs = JSON.parse(toolCall?.function?.arguments);
    const nombre = toolArgs?.nombre;
    const apellido = toolArgs?.apellido;
    const direccion = toolArgs?.direccion;
    const ciudad = toolArgs?.ciudad;
    const region = toolArgs?.region;
    const correo = toolArgs?.correo;
    const telefono = toolArgs?.telefono

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

    if (!nombre || !apellido || !direccion || !ciudad || !region || !correo || !telefono) {
        historyMessages.push(responseMessage);
        historyMessages.push({
            tool_call_id: toolID,
            role: "tool",
            name: toolName,
            content: requiredFieldsDontFound,
        });
        const completion = await getCompletion(client, historyMessages);
        const responseMessageContent = completion.choices[0].message.content.trim();

        historyMessages.push({ role: "assistant", content: responseMessageContent });

        return {
            historyMessages,
            responseMessageContent,
        };
    }

    historyMessages.push(responseMessage);
    historyMessages.push({
        tool_call_id: toolID,
        role: "tool",
        name: toolName,
        content: addAddressDataPrompt,
    });

    const completion = await getCompletion(client, historyMessages);
    const responseMessageContent = completion.choices[0].message.content.trim();
    historyMessages.push({ role: "assistant", content: responseMessageContent });

    await saveClientAddress(chatID, {
        firstName: nombre,
        lastName: apellido,
        address: direccion,
        city: ciudad,
        state: region,
        email: correo,
        phone: telefono,
    });
    
    return {
        historyMessages,
        responseMessageContent,
    };
};

module.exports = { addAddressDataTool, addAddressDataToolImplementation };
