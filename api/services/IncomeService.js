const database = require('../models');

class IncomeService {
    static async listIncomesByDescription(description) {
        try {
            const incomes = await database.Incomes.findAll({ where: {
                description
            }});
        
            return incomes;
        } catch (err) {
            throw err;
        }
    }

    static async listIncomesByMonth(month, year) {
        try {
            let incomes = await database.Incomes.findAll({ attributes: ['description', 'value', ['createdAt', 'date']]});
            let result = [];
            incomes.forEach(obj => {
                let date = obj.dataValues.date;
                let monthIncome = date.getMonth() + 1;
                let yearIncome = date.getFullYear();

                if(monthIncome === parseInt(month) && yearIncome === parseInt(year)) {
                    result.push(obj.dataValues);
                }
            });

            return result;

        } catch (err) {
            throw err;
        } 
    }

    static async listReview (month, year) {
        try {
            const incomes = await this.listIncomesByMonth(month, year);
            const sum = this.#sumIncomes(incomes);
            return sum;
        } catch (err) {
            throw err;
        }
    }

    static #sumIncomes (incomes) {
        let sum = 0;
        incomes.forEach(obj => {
            let value = obj.value;
            sum += value
        });

        return sum;
    }
}

module.exports = IncomeService;
