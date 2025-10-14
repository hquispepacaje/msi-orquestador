const getProductsPrompt = `De los productos disponibles, sugiere al usuario tres opciones que puedan interesarle según su consulta.
Solo debes incluir productos que estén dentro del JSON de content que se te entregó en el toolName.
En caso que no se alcancen los tres productos, puedes sugerir menos.
En caso de no encontrar productos que coincidan con la consulta del usuario, indícalo amablemente.
Cada producto debe ser presentado en el siguiente formato:
- Nombre del producto: [nombre del producto]
- Descripción corta: [descripción corta del producto]
- Precio regular: [precio regular del producto]
- Precio en oferta: [precio en oferta del producto] (si aplica)
- Imagen: [URL de la imagen del producto]
`;

const dontFoundCategoryPrompt = `La categoria que el usuario menciona no existe en la tienda.
Responde amablemente al usuario que la categoria no fue encontrada y mencinale las categorias que estén dentro del JSON de content que se te entregó en el toolName.
`;

const getProductsToolDescriptionPrompt = `Util cuando el usuario muestra interes en conocer y/o pedir recomendaciones sobre los productos de la tienda.
El cliente da información sobre sus preferencias y necesidades. Dentro de esa información, se encuentra el nombre de la categoría que le interesa.
`;

const getCategoryNamePrompt = `De la informacion proporcionada por el usuario, extrae el nombre de la categoría que el usuario busca.`;

module.exports = { getProductsPrompt, getProductsToolDescriptionPrompt, getCategoryNamePrompt, dontFoundCategoryPrompt };
