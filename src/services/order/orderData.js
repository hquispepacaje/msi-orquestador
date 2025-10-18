const { getDb } = require('../cosmoDb/db');
const COLLECTION_NAME = "order";

const getOrderData = async (chatID) => {
    const database = await getDb();
    const collection = database.collection(COLLECTION_NAME);
    try {
        const chatDocument = await collection.findOne({ _id: chatID });
        if (chatDocument && chatDocument.orderID && chatDocument.orderKey) {
            return {
                orderID,
                orderKey
            };
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};

const saveOrderData = async (chatID, orderID, orderKey) => {
    const database = await getDb();
    const collection = database.collection(COLLECTION_NAME);
    const chatDocument = {
        _id: chatID,
        orderID,
        orderKey,
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

const deleteOrderData = async (chatID) => {
    const database = await getDb();
    const collection = database.collection(COLLECTION_NAME);
    try {
        await collection.deleteOne({ _id: chatID });
    } catch (error) {
        throw error;
    }
};

module.exports = { getOrderData, saveOrderData, deleteOrderData };
