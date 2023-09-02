module.exports.UserRegistrationDTO = class UserRegistrationDTO {
    username;
    hash;
    constructor(username, hash) {
        this.username = username;
        this.hash = hash;
    }
}