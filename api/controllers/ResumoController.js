const ExpenseService = require('../services/ExpenseService.js');
const IncomeService = require('../services/IncomeService.js');

class ResumoController {
    static async listReview (req, res) {
        const {year, month} = req.params;
        try {
            const expensesSum = await ExpenseService.listReview(month, year);
            const incomesSum = await IncomeService.listReview(month, year);
            const review = incomesSum - expensesSum;
            res.status(200).json(review)
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = ResumoController;