const { MongoClient } = require('mongodb');

const DB_NAME = "VendedorIA";
const COLLECTION_NAME = "memory";

const connectionString = process.env.COSMOS_CONNECTION_STRING;
let db;

const initializeDbConnection = async () => {
    if (!connectionString) {
        throw new Error("COSMOS_CONNECTION_STRING no está definido. Por favor, añádelo a la configuración de tu Azure Function App.");
    }
    
    if (db) {
        return db;
    }

    try {
        const client = new MongoClient(connectionString);
        await client.connect();
        db = client.db(DB_NAME);

        return db;
    } catch (error) {
        throw error;
    }
}

const loadChatHistory = async (chatID) => {
    const database = await initializeDbConnection();
    const collection = database.collection(COLLECTION_NAME);

    try {
        const chatDocument = await collection.findOne({ _id: chatID });
        
        if (chatDocument && chatDocument.history) {
            return chatDocument.history;
        } else {
            return [];
        }
    } catch (error) {
        return []; 
    }
};

const saveChatHistory = async (chatID, historyMessages) => {
    const database = await initializeDbConnection();
    const collection = database.collection(COLLECTION_NAME);

    const chatDocument = {
        _id: chatID,
        memoryID: chatID,
        history: historyMessages,
        lastUpdated: new Date()
    };

    try {
        await collection.updateOne(
            { _id: chatID },
            { $set: chatDocument },
            { upsert: true }
        );
    } catch (error) {
        throw error;
    }
};

module.exports = { loadChatHistory, saveChatHistory };
