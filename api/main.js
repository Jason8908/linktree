const express = require('express');
const config = require('./config.json');
const { APIResponse } = require('./models/response');
const { Database } = require('./components/database');
const { APIService } = require('./components/services');
const { query, body, validationResult } = require('express-validator');

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
app.post('/register', body(['username', 'password']).notEmpty(), async (request, response) => {
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
        let password = request.body.password;
        res = await app.Service.registerUserMethod(username, password);
    }
    catch(err) {
        res = new APIResponse(500, ...[,,], err.toString());
    }
    return response.status(res.statusCode).send(res);
})

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