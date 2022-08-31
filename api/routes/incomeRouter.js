const { Router } = require('express');
const IncomeController = require('../controllers/IncomeController.js');
const Cliente = require('../controllers/ClienteController.js')

const incomeRouter = Router();

incomeRouter.post('/receitas', Cliente.checkToken, IncomeController.createIncome);
incomeRouter.get('/receitas', Cliente.checkToken, IncomeController.listIncomes);
incomeRouter.get('/receitas/:id', Cliente.checkToken, IncomeController.listIncomeById);
incomeRouter.put('/receitas/:id', Cliente.checkToken, IncomeController.updateIncome);
incomeRouter.delete('/receitas/:id', Cliente.checkToken, IncomeController.deleteIncome);

incomeRouter.get('/receitas/:month/:year', Cliente.checkToken, IncomeController.listIncomesByMonth);

module.exports = incomeRouter;