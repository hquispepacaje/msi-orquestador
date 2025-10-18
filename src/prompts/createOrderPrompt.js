const cartDontFoundPrompt = `Infórmale al usuario que no se encontró un carrito activo. Invítalo a agregar productos cuando lo desee y recuérdale que estás disponible para cualquier consulta.`;

const createOrderToolDescriptionPrompt = `Úsalo cuando el cliente quiera **finalizar la compra**, **pagar el carrito** o detectes una intención similar de checkout.`;

const billingAddressDontFoundPrompt = `Indícale al usuario de forma clara que sus datos de compra o envío **aún no se han registrado**.
Solicítale amablemente que envíe todos los datos necesarios para su compra. El mensaje del cliente debe incluir la frase **"agregar mis datos de compra"** (o similar) e inmediatamente después, la siguiente información:

**Datos Requeridos:**
1. Nombre
2. Apellido
3. Dirección
4. Ciudad
5. Región (Estado/Provincia)
6. Correo electrónico
7. Número de teléfono

Recuérdale que es esencial que su mensaje inicial contenga una declaración de intención como **"agregar mis datos de compra"** junto con la lista completa de datos para que el sistema pueda procesarlos correctamente.`;

const createOrderToolPrompt = `
Explícale al usuario que la compra está por completarse y que el paso final es el pago a través de Webpay Plus. Debes proveer el link de pago que entrega la herramienta en formato de **"Link de pago"** (sin mostrar la URL explícitamente).
`;

module.exports = { cartDontFoundPrompt, createOrderToolDescriptionPrompt, billingAddressDontFoundPrompt, createOrderToolPrompt };
