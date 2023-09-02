module.exports.APIResponse = class APIResponse {
    // Class fields
    statusCode;
    data;
    exception;
    errors;
    message;
    information;
    // Constructor
    constructor(statusCode, data = null, message = null, exception = null, errors = new Array(), info = new Array()) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.exception = exception;
        this.errors = errors;
        this.information = info;
    }
}