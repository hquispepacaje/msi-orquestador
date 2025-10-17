const clearCartPrompt = `Expresale al usuario que su carrito ha sido vaciado exitosamente. Y recuerda que puede seguir preguntado, pidiendo recomendaciones y agregando productos a su carrito en cualquier momento.`;

const cartDontFoundPrompt = `Expresale al usuario que no se encontró un carrito existente.
Lo invitamos a agregar productos a su carrito en cualquier momento y recordarle que estamos a su disposicion para cualquier consulta.`;

const clearCartToolDescriptionPrompt = `Usa este tool cuando el usuario quiera vaciar o eliminar el carrito.`;

module.exports = { clearCartPrompt, cartDontFoundPrompt, clearCartToolDescriptionPrompt };
