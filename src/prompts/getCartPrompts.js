const getCartPrompt = `Se te proporcionará la información actualizada del carrito en formato JSON. Debes:

1) Informar brevemente al usuario en español con tono amable y cercano que el producto fue agregado (por ejemplo: "¡Perfecto! He encontrado tu carrito.").

2) A continuación muestra un resumen claro y agradable del carrito en texto plano (NO devuelvas el JSON crudo). Usa únicamente los datos del JSON y no inventes nada. El resumen debe seguir este formato:

- Total de artículos: <itemCount>
- Artículos:
    - <quantity> x <name> (id: <id>) — precio unitario: <currencySymbol><price> — subtotal: <currencySymbol><lineTotal>
    - ...
- Total: <currencySymbol><totalPrice> (<currencyCode>)

3) Si falta algún dato necesario, no asumas valores: formula una pregunta breve y directa al usuario para obtener la información faltante.

Mantén el mensaje corto, amable y fácil de leer para el cliente.`;

const cartDontFoundPrompt = `Expresale al usuario que no se encontró un carrito existente.
Lo invitamos a agregar productos a su carrito en cualquier momento y recordarle que estamos a su disposicion para cualquier consulta.`;

const getCartToolDescriptionPrompt = `Usa este tool cuando el usuario quiera saber sobre su carrito, incluyendo los productos que contiene y su estado actual.`;

module.exports = { getCartPrompt, cartDontFoundPrompt, getCartToolDescriptionPrompt };
