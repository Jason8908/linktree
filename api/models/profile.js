module.exports.UserProfile = class UserProfile {
    displayID;
    name;
    userID;
    links;
    constructor(name, id, links, username) {
        this.displayID = username;
        this.name = name;
        this.userID = id;
        this.links = links;
    }
}