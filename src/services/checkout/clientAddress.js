const { getDb } = require('../cosmoDb/db');
const COLLECTION_NAME = "checkout";

const getClientAddress = async (chatID) => {
    const database = await getDb();
    const collection = database.collection(COLLECTION_NAME);
    try {
        const chatDocument = await collection.findOne({ _id: chatID });
        if (chatDocument && chatDocument.billingAddress) {
            return chatDocument.billingAddress;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

const saveClientAddress = async (chatID, billingAddress) => {
    const database = await getDb();
    const collection = database.collection(COLLECTION_NAME);
    const chatDocument = {
        _id: chatID,
        billingAddress,
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

const deleteClientAddress = async (chatID) => {
    const database = await getDb();
    const collection = database.collection(COLLECTION_NAME);
    try {
        await collection.deleteOne({ _id: chatID });
    } catch (error) {
        throw error;
    }
};

module.exports = { getClientAddress, saveClientAddress, deleteClientAddress };
