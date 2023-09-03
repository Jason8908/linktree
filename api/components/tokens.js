const jwt = require('jsonwebtoken');

module.exports.TokenService = class TokenService {
    static options = {
        algorithm: process.env.JWT_OPTIONS_ALGORITHM,
        expiresIn: process.env.JWT_OPTIONS_EXPIRES,
        issuer: process.env.JWT_OPTIONS_ISSUER
    }
    static verifyOptions = {
        issuer: process.env.JWT_VERIFY_OPTIONS_ISSUER,
        algorithms: process.env.JWT_VERIFY_OPTIONS_ALGORITHMS.split(',')
    }
    static generateToken(payload) {
        let token = jwt.sign(payload, process.env.JWT_SECRET, TokenService.options);
        return token;
    }
    static verifyToken(token) {
        let payload;
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET, TokenService.verifyOptions);
        }
        catch {
            payload = null;
        }
        return payload;
    }
}