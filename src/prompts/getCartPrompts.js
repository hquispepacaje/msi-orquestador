const getCartPrompt = `Se te proporcionará la información del carrito en formato json. Debes:
1) Informar al usuario en español que el producto ha sido agregado exitosamente al carrito.
2) Proporcionar un resumen del carrito usando exactamente el siguiente formato de objeto JSON (sin explicaciones adicionales ni texto extra):
itemCount,
items: cartData.items.map(item => ({
    key,
    id,
    name,
    quantity,
    price,
    lineTotal
})),
totals: {
    totalPrice,
    currencyCode,
    currencySymbol
}
Usa únicamente los valores presentes en json y no inventes datos. Si falta información necesaria, formula una pregunta breve al usuario.`;

const cartDontFoundPrompt = `Expresale al usuario que no se encontró un carrito existente.
Lo invitamos a agregar productos a su carrito en cualquier momento y recordarle que estamos a su disposicion para cualquier consulta.`;

const getCartToolDescriptionPrompt = `Usa este tool cuando el usuario quiera saber sobre su carrito, incluyendo los productos que contiene y su estado actual.`;

module.exports = { getCartPrompt, cartDontFoundPrompt, getCartToolDescriptionPrompt };
