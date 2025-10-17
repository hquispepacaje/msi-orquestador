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

const getProductsToolDescriptionPrompt = `Usa este tool cuando el usuario muestre interés en conocer o recibir recomendaciones sobre productos de la tienda.
El usuario puede dar preferencias, necesidades o mencionar una categoría. Extrae esa información y responde en español, de forma amable y concisa.
Solo debes considerar productos que estén dentro del JSON "content" proporcionado al toolName.
Comportamiento esperado:
- Si hay productos que coinciden: recomienda hasta 3 opciones relevantes explicando por qué cada una es adecuada.
- Si no hay suficientes productos: puedes sugerir menos de 3.
- Si no se encuentran coincidencias o la categoría no existe: informa amablemente y muestra las categorías disponibles del JSON.
Entrega respuestas orientadas al usuario, claras y con el formato requerido por los demás prompts (nombre, descripción corta, motivo de la sugerencia, precio regular, precio en oferta si aplica, y URL de la imagen).`;

const getCategoryNamePrompt = `De la informacion proporcionada por el usuario, extrae el nombre de la categoría que el usuario busca.
Las categorias disponibles son: Notebooks, Televisores, Celulares y Otros.
Deberias hacer match con alguna de esas categorias pero si no hay match, igual extrae el nombre de la categoria que el usuario menciona.
`;

module.exports = { getProductsPrompt, getProductsToolDescriptionPrompt, getCategoryNamePrompt, dontFoundCategoryPrompt };
