const database = require('../models');

class IncomeController {
    static async createIncome (req, res) {
        try {
            let income = req.body;
            income = await database.Incomes.create(income);
            res.status(200).send(income);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    static async listIncomes (req, res) {
        try {
            const income = await database.Incomes.findAll({ attributes: ['id', 'description', 'value', ['createdAt', 'date']]});
            res.status(200).send(income);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    static async listIncomeById (req, res) {
        try {
            const incomeId = req.params.id
            const income = await database.Incomes.findByPk(incomeId, {attributes: ['id', 'description', 'value', ['createdAt', 'date']]});
            res.status(200).send(income);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
    
    static async updateIncome (req, res) {
        try {
            let income = req.body;
            const id = req.params.id;
            await database.Incomes.update(income, {where: {
                id
            }});
            income = await database.Incomes.findByPk(id)
            res.status(200).send(income);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    static async deleteIncome (req, res) {
        try {
            const id = req.params.id;
            await database.Incomes.destroy({where: {
                id
            }});
            res.status(200).send({success: true});
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

module.exports = IncomeController;