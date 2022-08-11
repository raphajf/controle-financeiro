const { Router } = require('express');
const IncomeController = require('../controllers/IncomeController.js');

const incomeRouter = Router();

incomeRouter.post('/receitas', IncomeController.createIncome);
incomeRouter.get('/receitas', IncomeController.listIncomes);
incomeRouter.get('/receitas/:id', IncomeController.listIncomeById);
incomeRouter.put('/receitas/:id', IncomeController.updateIncome);
incomeRouter.delete('/receitas/:id', IncomeController.deleteIncome);

module.exports = incomeRouter;