const database = require('../models');
const ExpenseService = require('../services/ExpenseService.js');

class ExpenseController {
    static async createExpense (req, res) {
        let expense = req.body;
        try {
            expense = await ExpenseService.createExpense(expense)

            let date = expense.createdAt;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            date = `${day}/${month}/${year}`;
            expense = { id: expense.id, description: expense.description, type: expense.type, value: expense.value, date };

            res.status(200).json({ success: true, message: 'ok', expense });
        } catch (err) {
            if (err.message === 'Incorrect Type') {
                res.status(400).json({ success: false, message: err.message });
            } else {
                res.status(500).json({ success: false, message: err.message });
            }
        }
    }

    static async listExpenses (req, res) {
        const description = req.query.descricao;
        let expenses;
        try {
            if(!description) {
                expenses = await database.Expenses.findAll({ attributes: ['id', 'description', 'value', 'type', ['createdAt', 'date']]});
            } else {
                expenses = await ExpenseService.listExpensesByDescription(description);
            }
            res.status(200).json({ success: true, message: 'ok', expenses });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async listExpenseById (req, res) {
        try {
            const expenseId = req.params.id
            const expense = await database.Expenses.findByPk(expenseId, {attributes: ['id', 'description', 'value', ['createdAt', 'date']]});
            res.status(200).json({ success: true, message: 'ok', expenses });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async listExpensesByMonth (req, res) {
        const {year, month} = req.params;
        let expenses;
        try {
            if(parseInt(month) > 12 || parseInt(month) < 1 || year.length !== 4) {
                throw new Error('Incorrect Date');
            }

            expenses = await ExpenseService.listExpensesByMonth(month, year);
            if(expenses.length == 0) {
                res.status(200).json({ success: false, message: `Não foram encontrados registros para o mes ${month} do ano de ${year}`})
            }

            res.status(200).json({ success: true, message: 'ok', expenses });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
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
            res.status(200).send({ success: true, message: 'ok', expense });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async deleteExpense (req, res) {
        try {
            const id = req.params.id;
            await database.Expenses.destroy({where: {
                id
            }});
            res.status(200).send({ success: true, message: 'ok' });
        } catch (err) {
            res.status(500).send({ success: false, message: err.message });
        }
    }
}

module.exports = ExpenseController;