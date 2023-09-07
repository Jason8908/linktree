
module.exports.Link = class Link {
    _id;
    label;
    link;
    constructor(label, link, id) {
        this.label = label;
        this.link = link;
        this._id = id;
    }
}