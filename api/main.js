const express = require('express');
const config = require('./config.json');

const PORT = process.env.PORT || config.server.port;

// App setup
const app = express();
app.use(express.json());

// Start listening to requests
app.listen(PORT, () => {
    console.log(`API start and listening on port ${PORT}.`);
});

// Endpoints