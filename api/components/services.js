const { APIResponse } = require("../models/response");
const config = require('../config.json');
const bcrypt = require('bcryptjs');
const { TokenService } = require("./tokens");
const { Link } = require("../models/link");
const { UserProfile } = require("../models/profile");

module.exports.APIService = class APIService {
    // Class fields and constructor
    database;
    constructor(database) {
        this.database = database;
    }
    // Methods
    async registerUserMethod(username, password, name) {
        // Check if user is already registered.
        let user = await this.database.getUserByUsername(username);
        if (user)
            return new APIResponse(409, false, 'User is already registered.');
        // Register the user.
        let hash = this.#encrypt(password);
        let result = await this.database.registerUser(username, hash);
        // Create a profile for the user.
        let userID = result.insertedId;
        await this.database.createUserProfile(name, userID, username);
        return new APIResponse(201, true, 'Successfully registered.');
    }
    async loginUserMethod(username, password) {
        let user = await this.database.getUserByUsername(username);
        if (!user || !this.#checkHash(password, user.hash))
            return new APIResponse(401, false, "Incorrect username or password.");
        let token = TokenService.generateToken({ _id: user._id });
        return new APIResponse(201, token, 'Successfully logged in!');
    }
    async updateLinks(displayID, links) {
        let profile = await this.database.getProfileByDisplayID(displayID);
        if (!profile)
            return new APIResponse(404, null, `Profile with display ID: '${displayID}' does not exist.`);
        let linkArr = this.#convertLinksList(links);
        await this.database.updateLinks(displayID, linkArr);
        return new APIResponse(200, linkArr, 'Links successfully updated!');
    }
    async getProfileMethod(id) {
        let profile = await this.database.getProfileByDisplayID(id);
        if (!profile)
            return new APIResponse(404, null, `Profile with display ID: '${id}' does not exist.`);
        let result = new UserProfile(profile.name, profile.userID, profile.links, profile.displayID);
        return new APIResponse(200, result);
    }
    // Helpers
    #encrypt(data) {
        return bcrypt.hashSync(data, config.hash.saltLength);
    }
    #checkHash(expected, hash) {
        return bcrypt.compareSync(expected, hash);
    }
    #convertLinksList(links) {
        let result = [];
        for(var link of links)
            result.push(new Link(link.label, link.link));
        return result;
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