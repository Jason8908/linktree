const { APIResponse } = require("../models/response");

module.exports.APIService = class APIService {
    // Class fields and constructor
    database;
    constructor(database) {
        this.database = database;
    }
    // Methods
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