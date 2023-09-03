module.exports.UserRegistrationDTO = class UserRegistrationDTO {
    name;
    username;
    hash;
    constructor(username, hash, name) {
        this.name = name;
        this.username = username;
        this.hash = hash;
    }
}