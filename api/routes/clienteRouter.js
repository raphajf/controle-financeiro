const { Router } = require('express');
const ClienteController = require('../controllers/ClienteController.js');

const clienteRouter = Router();

clienteRouter.post('/clientes', ClienteController.createCliente);
clienteRouter.post('/clientes/login', ClienteController.loginCliente);

module.exports = clienteRouter;