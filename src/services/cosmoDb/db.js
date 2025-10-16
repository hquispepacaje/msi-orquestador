const { MongoClient } = require('mongodb');

const DB_NAME = "VendedorIA";
const connectionString = process.env.COSMOS_CONNECTION_STRING;
let dbInstance = null;

const getDb = async () => {
	if (!connectionString) {
		throw new Error("COSMOS_CONNECTION_STRING no está definido. Por favor, añádelo a la configuración de tu Azure Function App.");
	}
	if (dbInstance) {
		return dbInstance;
	}
	try {
		const clientInstance = new MongoClient(connectionString);
		await clientInstance.connect();
		dbInstance = clientInstance.db(DB_NAME);
		return dbInstance;
	} catch (error) {
		throw error;
	}
};

module.exports = { getDb };
