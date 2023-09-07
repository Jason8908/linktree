const { ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { DatabaseCollections } = require('../entities/collections');
const { SampleModel } =  require('../models/sample');

const { UserRegistrationDTO } = require('../models/registration');
const { UserProfile } = require('../models/profile');

module.exports.Database = class Database {
    // Class fields
    connectionString;
    client = null;
    database = null;
    // Constructor
    constructor() {
        this.connectionString = process.env.DATABASE_CONNECTION;
        // Null check
        if (!this.connectionString)
            throw new Error('Missing DATABASE_CONNECTION environment variable.');
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
        this.database = this.client.db(process.env.DATABASE_DEFAULT_DB);
    }
    async #disconnect() {
        // If there is no current connection.
        //if (!this.client) return;
        await this.client.close();
        // Removing the database field.
        this.database = null;
    }
    // General methods
    async registerUser(username, hash, name) {
        let result;
        let record = new UserRegistrationDTO(username, hash, name);
        try {
            await this.#connect();
            const users = this.database.collection(DatabaseCollections.Users);
            result = await users.insertOne(record);
        }
        finally {
            this.#disconnect();
        }
        return result;
    }
    async getUserByUsername(username) {
        let result;
        try {
            await this.#connect();
            let queryDoc = { username: username };
            const users = this.database.collection(DatabaseCollections.Users);
            result = await users.findOne(queryDoc);
        }
        finally {
            this.#disconnect();
        }
        return result;
    }
    async createUserProfile(name, userID, username) {
        let result;
        let record = new UserProfile(name, userID, [], username);
        try {
            await this.#connect();
            const profiles = this.database.collection(DatabaseCollections.Profiles);
            result = await profiles.insertOne(record);
        }
        finally {
            this.#disconnect();
        }
        return result;
    }
    async getProfileByUserID(id) {
        let result;
        try {
            await this.#connect();
            let queryDoc = { userID: id };
            const profiles = this.database.collection(DatabaseCollections.Profiles);
            result = await profiles.findOne(queryDoc);
        }
        finally {
            this.#disconnect();
        }
        return result;
    }
    async getProfileByDisplayID(id) {
        let result;
        try {
            await this.#connect();
            let queryDoc = { displayID: id };
            const profiles = this.database.collection(DatabaseCollections.Profiles);
            result = await profiles.findOne(queryDoc);
        }
        finally {
            this.#disconnect();
        }
        return result;
    }
    async updateLinks(id, links) {
        let result;
        try {
            await this.#connect();
            let filter = { displayID: id };
            let updateDoc = {
                $set: {
                    links: links
                }
            };
            const profiles = this.database.collection(DatabaseCollections.Profiles);
            result = await profiles.updateOne(filter, updateDoc);
        }
        finally {
            this.#disconnect();
        }
        return result;
    }
    async getProfileByUserID(id) {
        let result;
        try {
            await this.#connect();
            let queryDoc = { userID: new ObjectId(id) };
            const profiles = this.database.collection(DatabaseCollections.Profiles);
            result = await profiles.findOne(queryDoc);
        }
        finally {
            this.#disconnect();
        }
        return result;
    }
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