const database = require('../models');
const IncomeService = require('../services/IncomeService.js');

class IncomeController {
    static async createIncome (req, res) {
        try {
            let income = req.body;
            
            income = await database.Incomes.create(income);
            let date = income.createdAt;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            date = `${day}/${month}/${year}`;
            income = { id: income.id, description: income.description, value: income.value, date };

            res.status(200).json({ success: true, message: 'ok', income });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async listIncomes (req, res) {
        const description = req.query.descricao;
        let incomes;
        try {
            if (!description) {
                incomes = await database.Incomes.findAll({ attributes: ['id', 'description', 'value', ['createdAt', 'date']]});
            } else {
                incomes = await IncomeService.listIncomesByDescription(description);
            }

            res.status(200).json({ success: true, message: 'ok', incomes });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async listIncomesByMonth (req, res) {
        const {year, month} = req.params;
        let incomes;
        try {
            if(parseInt(month) > 12 || parseInt(month) < 1 || year.length !== 4) {
                throw new Error('Incorrect Date');
            }

            incomes = await IncomeService.listIncomesByMonth(month, year);
            if(incomes.length == 0) {
                res.status(200).json({ message: `Não foram encontrados registros para o mes ${month} do ano de ${year}`})
            }

            res.status(200).json({ success: true, message: 'ok', incomes });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async listIncomeById (req, res) {
        try {
            const incomeId = req.params.id
            const income = await database.Incomes.findByPk(incomeId, {attributes: ['id', 'description', 'value', ['createdAt', 'date']]});
            res.status(200).json({ success: true, message: 'ok', income });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
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
            res.status(200).send({ success: true, message: 'ok', income });
        } catch (err) {
            res.status(500).send({ success: false, message: err.message });
        }
    }

    static async deleteIncome (req, res) {
        try {
            const id = req.params.id;
            await database.Incomes.destroy({where: {
                id
            }});
            res.status(200).send({ success: true, message: 'ok' });
        } catch (err) {
            res.status(500).send({ success: false, message: err.message });
        }
    }
}

module.exports = IncomeController;