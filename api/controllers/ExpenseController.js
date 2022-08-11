const database = require('../models');

class ExpenseController {
    static async createExpense (req, res) {
        try {
            let expense = req.body;
            expense = await database.Expenses.create(expense);
            res.status(200).send(expense);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    static async listExpenses (req, res) {
        try {
            const expense = await database.Expenses.findAll({ attributes: ['id', 'description', 'value', ['createdAt', 'date']]});
            res.status(200).send(expense);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    static async listExpenseById (req, res) {
        try {
            const expenseId = req.params.id
            const expense = await database.Expenses.findByPk(expenseId, {attributes: ['id', 'description', 'value', ['createdAt', 'date']]});
            res.status(200).send(expense);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
    
    static async updateExpense (req, res) {
        try {
            let expense = req.body;
            const id = req.params.id;
            await database.Expenses.update(expense, {where: {
                id
            }});
            expense = await database.Expenses.findByPk(id)
            res.status(200).send(expense);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    static async deleteExpense (req, res) {
        try {
            const id = req.params.id;
            await database.Expenses.destroy({where: {
                id
            }});
            res.status(200).send({success: true});
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

module.exports = ExpenseController;