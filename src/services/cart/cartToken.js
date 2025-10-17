const { getDb } = require('../cosmoDb/db');
const COLLECTION_NAME = "cart";

const getCartToken = async (chatID) => {
    const database = await getDb();
    const collection = database.collection(COLLECTION_NAME);
    try {
        const chatDocument = await collection.findOne({ _id: chatID });
        if (chatDocument && chatDocument.cartToken) {
            return chatDocument.cartToken;
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

const saveCartToken = async (chatID, cartToken) => {
    const database = await getDb();
    const collection = database.collection(COLLECTION_NAME);
    const chatDocument = {
        _id: chatID,
        cartToken,
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

const deleteCartToken = async (chatID) => {
    const database = await getDb();
    const collection = database.collection(COLLECTION_NAME);
    try {
        await collection.deleteOne({ _id: chatID });
    } catch (error) {
        throw error;
    }
};

module.exports = { getCartToken, saveCartToken, deleteCartToken };
