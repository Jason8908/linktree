const { APIResponse } = require("../models/response");
const config = require('../config.json');
const bcrypt = require('bcryptjs');
const { TokenService } = require("./tokens");

module.exports.APIService = class APIService {
    // Class fields and constructor
    database;
    constructor(database) {
        this.database = database;
    }
    // Methods
    async registerUserMethod(username, password) {
        // Check if user is already registered.
        let user = await this.database.getUserByUsername(username);
        if (user)
            return new APIResponse(409, false, 'User is already registered.');
        // Register the user.
        let hash = this.#encrypt(password);
        await this.database.registerUser(username, hash);
        return new APIResponse(201, true, 'Successfully registered.');
    }
    async loginUserMethod(username, password) {
        let user = await this.database.getUserByUsername(username);
        if (!user || !this.#checkHash(password, user.hash))
            return new APIResponse(401, false, "Incorrect username or password.");
        let token = TokenService.generateToken({ _id: user._id });
        return new APIResponse(201, token, 'Successfully logged in!');
    }
    // Helpers
    #encrypt(data) {
        return bcrypt.hashSync(data, config.hash.saltLength);
    }
    #checkHash(expected, hash) {
        return bcrypt.compareSync(expected, hash);
    }

    // Sample methods
    // async sampleWriteMethod(data) {
    //     let res;
    //     try {
    //         let result = await this.database.sampleWrite(data);
    //         res = new APIResponse(201, result, 'Successfully inserted!');
    //     }
    //     catch(err) {
    //         res = new APIResponse(500, ...[,,], err.toString());
    //     }
    //     return res;
    // }
}