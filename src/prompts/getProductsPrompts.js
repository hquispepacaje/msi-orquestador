const getProductsPrompt = `De los productos disponibles, sugiere al usuario tres opciones que puedan interesarle según su consulta.
Solo debes incluir productos que estén dentro del JSON de content que se te entregó en el toolName.
En caso que no se alcancen los tres productos, puedes sugerir menos.
En caso de no encontrar productos que coincidan con la consulta del usuario, indícalo amablemente.
Se le debe explicar al usuario por qué se le están sugiriendo esos productos.
Cada producto debe ser presentado en el siguiente formato:
- [nombre del producto]
- [descripción corta del producto]
- [explicación de por qué se sugiere este producto]
- Precio: [precio regular del producto]
- Precio oferta: [precio en oferta del producto] (Solamente si tiene precio en oferta)
- Imagen: [URL de la imagen del producto]
`;

const getProductsToolDescriptionPrompt = `Util cuando el usuario muestra interes en conocer y/o pedir recomendaciones sobre los productos de la tienda.
El cliente debe hacer la consulta de manera general, sin mencionar categorías específicas, pero puede proporcionar información relevante.
`;

module.exports = { getProductsPrompt, getProductsToolDescriptionPrompt };
