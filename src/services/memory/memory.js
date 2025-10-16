const { getDb } = require('../cosmoDb/db');
const COLLECTION_NAME = "memory";

const loadChatHistory = async (chatID) => {
    const database = await getDb();
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
    const database = await getDb();
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
