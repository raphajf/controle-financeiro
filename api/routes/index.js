const bodyParser = require('body-parser');
const incomeRouter = require('./incomeRouter.js');
const expenseRouter = require('./expenseRouter.js');
const reviewRouter = require('./monthlyReviewRouter.js');
const clienteRouter = require('./clienteRouter.js')

module.exports = app => {
    app.use(bodyParser.json());
    app.use(incomeRouter);
    app.use(expenseRouter);
    app.use(reviewRouter);
    app.use(clienteRouter)
    app.use(bodyParser.urlencoded({ extended: true /**or false */ }));
    app.get('/', (req, res, next) => {
        res.status(200).send({success: true});
    });
}