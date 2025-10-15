const getProductsPrompt = `De los productos disponibles, sugiere al usuario tres opciones que puedan interesarle según su consulta.
Solo debes incluir productos que estén dentro del JSON de content que se te entregó en el toolName.
En caso que no se alcancen los tres productos, puedes sugerir menos.
En caso de no encontrar productos que coincidan con la consulta del usuario, indícalo amablemente.
Se le debe explicar al usuario por qué se le está sugiriendo cada producto.
Cada producto debe ser presentado en el siguiente formato:
- [nombre del producto]
- [descripción corta del producto]
- [explicación de por qué se sugiere este producto]
- Precio: [precio regular del producto]
- Precio oferta: [precio en oferta del producto] (Solamente si tiene precio en oferta)
- Imagen: [URL de la imagen del producto]
`;

const dontFoundCategoryPrompt = `La categoria que el usuario menciona no existe en la tienda.
Responde amablemente al usuario que la categoria no fue encontrada y mencionale las categorias que estén dentro del JSON de content que se te entregó en el toolName.
`;

const getProductsToolDescriptionPrompt = `Util cuando el usuario muestra interes en conocer y/o pedir recomendaciones sobre los productos de la tienda.
El cliente da información sobre sus preferencias y necesidades. Dentro de esa información, se encuentra el nombre de la categoría que le interesa.
`;

const getCategoryNamePrompt = `De la informacion proporcionada por el usuario, extrae el nombre de la categoría que el usuario busca.`;

module.exports = { getProductsPrompt, getProductsToolDescriptionPrompt, getCategoryNamePrompt, dontFoundCategoryPrompt };
