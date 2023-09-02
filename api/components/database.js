const { MongoClient, ServerApiVersion } = require('mongodb');
const { DatabaseCollections } = require('../entities/collections');
const { SampleModel } =  require('../models/sample');

const config = require('../config.json');

module.exports.Database = class Database {
    // Class fields
    connectionString;
    client = null;
    database = null;
    // Constructor
    constructor() {
        this.connectionString = config.database.connection;
        // Null check
        if (!this.connectionString)
            throw new Error('Missing database:connection configuration field.');
        // Creating the MongoDB client
        this.client = new MongoClient(this.connectionString, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
    }
    // Connection methods
    async #connect() {
        // If already connected to DB.
        //if (this.client) return;
        await this.client.connect();
        // Setting the database field.
        this.database = this.client.db(config.database.defaultDB);
    }
    async #disconnect() {
        // If there is no current connection.
        //if (!this.client) return;
        await this.client.close();
        // Removing the database field.
        this.database = null;
    }
    // General methods
    // Sample methods
    // async sampleWrite(data) {
    //     let record = new SampleModel(data);
    //     let result;
    //     try {
    //         // Connecting to the DB.
    //         await this.#connect();
    //         // Writing the data to the DB.
    //         const sample = this.database.collection(DatabaseCollections.Sample);
    //         result = await sample.insertOne(record);
    //     }
    //     finally {
    //         this.#disconnect();
    //     }
    //     return result;
    // }
}