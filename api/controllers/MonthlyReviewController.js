const ExpenseService = require('../services/ExpenseService.js');
const IncomeService = require('../services/IncomeService.js');

class MonthlyReviewController {
    static async listReview (req, res) {
        const { year, month } = req.params;
        try {
            const expensesSum = await ExpenseService.listReview(month, year);
            const incomesSum = await IncomeService.listReview(month, year);
            const sumByType = await ExpenseService.listReviewByType(month, year);
            const review = incomesSum - expensesSum;

            let reviewByType = [];
            for (let i = 0; i < sumByType.length; i++) {
                let type = sumByType[i];
                let value = sumByType[i + 1];
                
                if(i % 2 === 0) {
                    value = value.toFixed(2)
                    reviewByType.push({type, value});
                } else {
                    continue;
                }
            }

            res.status(200).json({ receita: review.toFixed(2), incomes: incomesSum.toFixed(2), expenses: expensesSum.toFixed(2), reviewByType});
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = MonthlyReviewController;