const { Router } = require('express');
const ExpenseController = require('../controllers/ExpenseController.js');

const expenseRouter = Router();

expenseRouter.post('/despesas', ExpenseController.createExpense);
expenseRouter.get('/despesas', ExpenseController.listExpenses);
expenseRouter.get('/despesas/:id', ExpenseController.listExpenseById);
expenseRouter.put('/despesas/:id', ExpenseController.updateExpense);
expenseRouter.delete('/despesas/:id', ExpenseController.deleteExpense);

module.exports = expenseRouter;