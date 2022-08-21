const ExpenseService = require('../services/ExpenseService.js');
const IncomeService = require('../services/IncomeService.js');

class ResumoController {
    static async listReview (req, res) {
        const {year, month} = req.params;
        try {
            const expensesSum = await ExpenseService.listReview(month, year);
            const incomesSum = await IncomeService.listReview(month, year);
            const sumByType = await ExpenseService.listReviewByType(month, year);
            const review = incomesSum - expensesSum;

            let resumoPorCat = [];
            for (let i = 0; i < sumByType.length; i++) {
                let type = sumByType[i];
                let value = sumByType[i + 1];
                if(i % 2 === 0) {
                    resumoPorCat.push({type, value});
                } else {
                    continue;
                }
            }
            res.status(200).json({ receita: review, incomes: incomesSum, expenses: expensesSum, resumoPorCat});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = ResumoController;