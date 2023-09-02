module.exports.UserProfile = class UserProfile {
    name;
    userID;
    links;
    constructor(name, id, links) {
        this.name = name;
        this.userID = id;
        this.links = links;
    }
}