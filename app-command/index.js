'use strict';

const express = require('express');
const logger = require('./utilities/logger');
const allowAllCors = require('./middleware/allow-all-cors');
const errorHandlerMiddleware = require('./middleware/error-handler');
const controllers = require('./controllers');

const app = express();
app.use(allowAllCors);
app.use('/api', controllers);
app.use(errorHandlerMiddleware);

app.listen(8001);

logger.info("Friend management command API started listening on port 8001");
logger.info("To test, go to http://localhost:8001/api/monitoring/ping");
