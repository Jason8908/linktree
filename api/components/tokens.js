const config = require('../config.json');
const jwt = require('jsonwebtoken');

module.exports.TokenService = class TokenService {
    static generateToken(payload) {
        const settings = config.jwt;
        let token = jwt.sign(payload, settings.secret, settings.options);
        return token;
    }
}