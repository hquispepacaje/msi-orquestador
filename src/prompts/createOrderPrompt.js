const cartDontFoundPrompt = `Infórmale al usuario que no se encontró un carrito activo. Invítalo a agregar productos cuando lo desee y recuérdale que estás disponible para cualquier consulta.`;

const createOrderToolDescriptionPrompt = `Úsalo cuando el cliente quiera **finalizar la compra**, **pagar el carrito** o detectes una intención similar de checkout.`;

const billingAddressDontFoundPrompt = `
Indícale al usuario que no se han registrado sus datos de facturación.
Solicítale que envíe sus datos de compra, que deben incluir la siguiente información:
1. Nombre
2. Apellido
3. Dirección
4. Ciudad
5. Región
6. Correo electrónico
7. Número de teléfono
Recuérdale que su mensaje debe ser una declaración clara de **"agregar mis datos de compra"** o similar, seguido de la información.
`;

const createOrderToolPrompt = `
Explícale al usuario que la compra está por completarse y que el paso final es el pago a través de Webpay Plus. Debes proveer el link de pago que entrega la herramienta en formato de **"Link de pago"** (sin mostrar la URL explícitamente).
`;

module.exports = { cartDontFoundPrompt, createOrderToolDescriptionPrompt, billingAddressDontFoundPrompt, createOrderToolPrompt };
