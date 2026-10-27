const express = require('express');
const prestadorRoutes = require('./routes/prestador.routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use('/prestadores', prestadorRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
