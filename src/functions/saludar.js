const { app } = require("@azure/functions");

app.http('saludar', {
    methods: ['GET', 'POST'], // La función puede ser llamada con GET o POST
    authLevel: 'anonymous', // No requiere clave de API para pruebas
    handler: async (request, context) => {
        
        context.log(`Petición HTTP recibida. URL: ${request.url}`);

        // 1. Obtener el nombre del cuerpo (POST) o de los parámetros de la URL (GET)
        let nombre;
        try {
            const body = await request.json();
            nombre = body.nombre || request.query.get('nombre');
        } catch (error) {
            nombre = request.query.get('nombre');
        }
        
        // 2. Definir el mensaje de respuesta
        const mensaje = nombre 
            ? `¡Hola, ${nombre}!` 
            : "¡Hola Mundo! Por favor, pasa un nombre en el cuerpo de la petición o en el parámetro 'nombre' de la consulta.";

        // 3. Devolver la respuesta HTTP
        return { 
            status: 200, 
            body: mensaje 
        };
    }
});