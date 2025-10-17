const addCartItemPrompt = `Se te proporcionará la información actualizada del carrito en formato json. Debes:
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

const addCartItemToolDescriptionPrompt = `Usa este tool cuando el usuario que quiere agregar un producto al carrito.
Debes extraer el [id] del producto y la [cantidad] que desea agregar, la cantidad es opcional y por defecto es 1.
Debe haber preguntado por un producto en especifico o haber mostrado interes en uno previamente, ya que se necesita el [id] del producto.
`;

const getProductIDPrompt = `De la informacion proporcionada por el usuario y del historial de mensajes detecta cual es el producto que quiere agregar al carrito y extrae su [id].`;

const getQuantityPrompt = `De la informacion proporcionada por el usuario y del historial de mensajes detecta cual es la [cantidad] del producto que quiere agregar al carrito. Si no se especifica una cantidad, asume que es 1.`;

module.exports = { addCartItemPrompt, addCartItemToolDescriptionPrompt, getProductIDPrompt, getQuantityPrompt };
