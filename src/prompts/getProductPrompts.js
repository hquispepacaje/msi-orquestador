const getProductPrompt = `Debes recomendar el producto con el fin de realizar la venta, intentar convencer al usuario de comprar el producto.
Debes usar un lenguaje persuasivo y amigable, destacando las características y beneficios del producto.
El producto debe ser presentado en el siguiente formato:
- [nombre del producto]
- [descripción corta del producto]
- [explicación de por qué se sugiere este producto]
- Precio: [precio regular del producto]
- Precio oferta: [precio en oferta del producto] (Solamente si tiene precio en oferta)
- Imagenes: [URLs de la imagen del producto]
`;

const getProductToolDescriptionPrompt = `Usa esta herramienta solo cuando el usuario haya mostrado interés explícito en un producto concreto de la tienda (por ejemplo: pidió recomendaciones para un producto específico, mencionó un nombre exacto, proporcionó un enlace, imagen o el [id] del producto). La herramienta requiere recibir el [id] del producto.

Reglas:
- Si el [id] está presente en el mensaje o en el historial, invoca la herramienta con ese id.
- Si no hay un id claro, NO llames a la herramienta. En su lugar, solicita de forma breve y amable que el usuario proporcione el id, el nombre exacto, enlace o una foto del producto.
- Si la información es parcial, pide datos que ayuden a identificar el producto: marca, modelo, color, características distintivas o rango de precio.

Formato de interacción: pregunta brevemente para obtener el dato faltante o procede a invocar la herramienta únicamente cuando el [id] esté disponible. Mantén el tono amable y enfocado en ayudar al usuario a encontrar el producto.`;

const getProductIDPrompt = `De la informacion proporcionada por el usuario y del historial de mensajes detecta cual es el producto que quiere y extrae su [id].`;

module.exports = { getProductPrompt, getProductToolDescriptionPrompt, getProductIDPrompt };
