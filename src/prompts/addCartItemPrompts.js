const addCartItemPrompt = `Se te proporcionará la información actualizada del carrito en formato JSON. Debes:

1) Informar brevemente al usuario en español con tono amable y cercano que el producto fue agregado (por ejemplo: "¡Perfecto! He agregado el producto a tu carrito.").

2) A continuación muestra un resumen claro y agradable del carrito en texto plano (NO devuelvas el JSON crudo). Usa únicamente los datos del JSON y no inventes nada. El resumen debe seguir este formato:

- Total de artículos: <itemCount>
- Artículos:
    - <quantity> x <name> (id: <id>) — precio unitario: <currencySymbol><price> — subtotal: <currencySymbol><lineTotal>
    - ...
- Total: <currencySymbol><totalPrice> (<currencyCode>)

3) Si falta algún dato necesario, no asumas valores: formula una pregunta breve y directa al usuario para obtener la información faltante.

Mantén el mensaje corto, amable y fácil de leer para el cliente.`;

const addCartItemToolDescriptionPrompt = `Usa este tool cuando el usuario que quiere agregar un producto al carrito.
Debes extraer el [id] del producto y la [cantidad] que desea agregar, la cantidad es opcional y por defecto es 1.
Debe haber preguntado por un producto en especifico o haber mostrado interes en uno previamente, ya que se necesita el [id] del producto.

En caso de no encontrar el id, revisa el historial de mensajes para hacer match con el producto que el cliente haya mostrado interes y obtener su [id].

Formato de interacción: pregunta brevemente para obtener el dato faltante o procede a invocar la herramienta únicamente cuando el [id] esté disponible. Mantén el tono amable y enfocado en ayudar al usuario a encontrar el producto.
`;

const getProductIDPrompt = `De la informacion proporcionada por el usuario y del historial de mensajes detecta cual es el producto que quiere agregar al carrito y extrae su [id].`;

const getQuantityPrompt = `De la informacion proporcionada por el usuario y del historial de mensajes detecta cual es la [cantidad] del producto que quiere agregar al carrito. Si no se especifica una cantidad, asume que es 1.`;

module.exports = { addCartItemPrompt, addCartItemToolDescriptionPrompt, getProductIDPrompt, getQuantityPrompt };
