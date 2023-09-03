const config = require('../config.json');
const jwt = require('jsonwebtoken');

module.exports.TokenService = class TokenService {
    static generateToken(payload) {
        const settings = config.jwt;
        let token = jwt.sign(payload, settings.secret, settings.options);
        return token;
    }
    static verifyToken(token) {
        const settings = config.jwt;
        let payload;
        try {
            payload = jwt.verify(token, settings.secret, settings.verifyOptions);
        }
        catch {
            payload = null;
        }
        return payload;
    }
}