const express = require('express');
const config = require('./config.json');
const { APIResponse } = require('./models/response');
const { Database } = require('./components/database');
const { APIService } = require('./components/services');
const { query, body, param, validationResult } = require('express-validator');
const { TokenService } = require('./components/tokens');

const PORT = process.env.PORT || config.server.port;

// App setup
const app = express();
app.use(express.json());

// Dependencies
app.Database = new Database();
app.Service = new APIService(app.Database);

// Start listening to requests
app.listen(PORT, () => {
    console.log(`API started and listening on port ${PORT}.`);
});

// Endpoints
app.get('/status', (request, response) => {
    let res = new APIResponse(200, `API started and listening on port ${PORT}.`)
    response.status(res.statusCode).send(res);
});
app.post('/register', body(['username', 'password', 'name']).notEmpty().escape(), async (request, response) => {
    let res;
    // Validating request body.
    const validation = validationResult(request);
    if (!validation.isEmpty()) {
        let errors = validation.array();
        res = new APIResponse(400, ...[,,,], errors);
        return response.status(res.statusCode).send(res);
    }
    // Performing the action.
    try {
        let username = request.body.username.toLowerCase();
        let name = request.body.name;
        let password = request.body.password;
        res = await app.Service.registerUserMethod(username, password, name);
    }
    catch(err) {
        res = new APIResponse(500, ...[,,], err.toString());
    }
    return response.status(res.statusCode).send(res);
});
app.post('/login', body(['username', 'password']).notEmpty().escape(), async (request, response) => {
    let res;
    // Validating request body.
    const validation = validateRequest(request);
    if (validation)
        return response.status(validation.statusCode, validation);
    // Performing the action.
    try {
        let username = request.body.username.toLowerCase();
        let password = request.body.password;
        res = await app.Service.loginUserMethod(username, password);
    }
    catch(err) {
        res = new APIResponse(500, ...[,,], err.toString());
    }
    return response.status(res.statusCode).send(res);
});
app.put('/links/:displayID', body(['links.*.label', 'links.*.link']).notEmpty(), async (request, response) => {
    let res;
    let payload = authorize(request);
    // Authorizing request
    if (!payload) {
        res = new APIResponse(401, null, 'Unauthorized.');
        return response.status(res.statusCode).send(res);
    }
    // Validating request body.
    const validation = validateRequest(request);
    if (validation)
        return response.status(validation.statusCode).send(validation);
    // Performing the action.
    try {
        let displayID = request.params['displayID'];
        let links = request.body.links;
        res = await app.Service.updateLinks(displayID, links, payload);
    }
    catch(err) {
        res = new APIResponse(500, ...[,,], err.toString());
    }
    return response.status(res.statusCode).send(res);
});
app.get('/profile/:displayID', param('displayID').notEmpty(), async (request, response) => {
    let res;
    // Validating request body.
    const validation = validateRequest(request);
    if (validation)
        return response.status(validation.statusCode).send(validation);
    // Performing the action.
    try {
        let displayID = request.params['displayID'];
        res = await app.Service.getProfileMethod(displayID);
    }
    catch(err) {
        res = new APIResponse(500, ...[,,], err.toString());
    }
    return response.status(res.statusCode).send(res);
});

// Validation helper
// Returns null if validation of the request was successful, and 400 response if not.
function validateRequest(request) {
    const validation = validationResult(request);
    if (!validation.isEmpty()) {
        let errors = validation.array();
        let res = new APIResponse(400, ...[,,,], errors);
        return res;
    }
    return null;
}
// Authorization
// Returns payload if token is valid, and null if not.
function authorize(request) {
    let jwt = request.headers['authorization'];
    if (!jwt) return null;
    let payload = TokenService.verifyToken(jwt);
    if (!payload || !payload._id) return null;
    return payload;
}

module.exports = app;

// Sample endpoints
// app.post('/sample', body('data').notEmpty(), async (request, response) => {
//     const valResult = validationResult(request);
//     let res;
//     // Getting and validating request body.
//     let data = request.body.data;
//     if (valResult.isEmpty()) {
//         // Performing the action.
//         try {
//             res = await app.Service.sampleWriteMethod(data);
//         }
//         catch(err) {
//             res = new APIResponse(500, ...[,,], err);
//         }
//         response.status(res.statusCode).send(res);
//     }
//     else {
//         res = new APIResponse(400, ...[,,,], valResult.array());
//         return response.status(400).send(res);
//     }
// })