const cartDontFoundPrompt = `Expresale al usuario que no se encontró un carrito existente.
Lo invitamos a agregar productos a su carrito en cualquier momento y recordarle que estamos a su disposicion para cualquier consulta.`;

const addAddressDataToolDescriptionPrompt = `Usa esta herramienta cuando el cliente manifieste la intención de **agregar o actualizar sus datos de compra o envío**.

**Todos los datos son requeridos** para proceder:
1. nombre
2. apellido
3. direccion
4. ciudad
5. region
6. correo electrónico
7. número de teléfono

Si algún dato de esta lista está faltando o es incorrecto, debes informarle al cliente de manera clara que **necesita proporcionar todos los datos correctamente para continuar** y debes recordale los datos que tiene que enviar.`;

const getFirstNamePrompt = `Extrae y devuelve únicamente el nombre de pila (primer nombre) del cliente del texto proporcionado.`;

const getLastNamePrompt = `Extrae y devuelve únicamente el apellido del cliente del texto proporcionado.`;

const getAddressPrompt = `Extrae y devuelve la dirección completa del cliente (calle, número y cualquier detalle adicional como apartamento/piso) del texto proporcionado.`;

const getCityPrompt = `Extrae y devuelve únicamente el nombre de la ciudad de residencia del cliente del texto proporcionado.`;

const getStatePrompt = `Extrae y devuelve únicamente el Estado, Provincia o Región del cliente del texto proporcionado.`;

const getEmailPrompt = `Extrae y devuelve únicamente la dirección de correo electrónico del cliente del texto proporcionado. Asegúrate de que tenga un formato de email válido.`;

const getPhonePrompt = `Extrae y devuelve únicamente el número de teléfono de contacto del cliente del texto proporcionado (incluyendo el código de área/país si se proporcionó).`;

const requiredFieldsDontFound = `Expresale al usuario que no se pudo continuar porque faltan datos requeridos.
Pídele amablemente que proporcione la información faltante para poder procesar su compra o envío.`;

const addAddressDataPrompt = `Indica al cliente que su información de compra y envío ha sido guardada correctamente.
Luego, muéstrale de forma clara y organizada todos los datos que se han registrado (Nombre, Apellido, Dirección, Ciudad, Región, País, Correo Electrónico y Teléfono).
Finalmente, hazle saber que si identifica algún error en los datos mostrados, puede modificarlos en cualquier momento.`;

module.exports = {
    cartDontFoundPrompt,
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
};
