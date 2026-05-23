const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "KalixCodex";

let database;

async function connectToDatabase() {
  if (database) {
    return database;
  }

  const client = new MongoClient(uri);
  await client.connect();

  database = client.db(dbName);
  console.log(`Connected to MongoDB database: ${dbName}`);

  return database;
}

function getDatabase() {
  if (!database) {
    throw new Error("Database has not been initialized. Call connectToDatabase first.");
  }

  return database;
}

module.exports = {
  connectToDatabase,
  getDatabase
};