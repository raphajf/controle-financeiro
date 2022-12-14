const database = require('../models');

class ExpenseService {
    static #validateType (type) {
        const correctTypes = ['Alimentacao', 'Saude', 'Moradia', 'Transporte', 'Educacao', 'Lazer', 'Imprevistos', 'Outros'];
        const index = correctTypes.indexOf(type);
        if (index != -1) {
            return true;
        } else {
            return false;
        }
    }
    
    static async createExpense (expense) {
        if (!expense.type) {
            expense.type = 'Outros'
        }

        try {
            const validate = this.#validateType(expense.type);
            if(validate) {
                expense = await database.Expenses.create(expense);
                return expense;
            } else {
                throw new Error('Incorrect Type')
            }
        } catch (err) {
            throw err;
        }
    }

    static async listExpensesByDescription(description) {
        try {
            const expenses = await database.Expenses.findAll({ where: {
                description
            }});
        
            return expenses;
        } catch (err) {
            throw err;
        }
    }

    static async listExpensesByMonth(month, year) {
        try {
            let expenses = await database.Expenses.findAll({ attributes: ['description', 'value', 'type', ['createdAt', 'date']]});
            let result = [];
            expenses.forEach(obj => {
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
            const expenses = await this.listExpensesByMonth(month, year);
            const sum = this.#sumExpenses(expenses);
            return sum;
        } catch (err) {
            throw err;
        }
    }

    static async listReviewByType (month, year) {
        try {
            const expenses = await this.listExpensesByMonth(month, year);
            let sumByType = []; 
            expenses.forEach(obj => {
                let index = sumByType.indexOf(obj.type);

                if (sumByType.length === 0) {
                    sumByType.push(obj.type);
                    sumByType.push(obj.value);
                } else {
                    if(index != -1) {
                        sumByType[index + 1] += obj.value;
                    } else {
                        sumByType.push(obj.type);
                        sumByType.push(obj.value);
                    }
                }
            })
            return sumByType;
        } catch (err) {
            throw err;
        }
    }

    static #sumExpenses (expenses) {
        let sum = 0;
        expenses.forEach(obj => {
            let value = obj.value;
            sum += value
        });

        return sum;
    }
}

module.exports = ExpenseService;
