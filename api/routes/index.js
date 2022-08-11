const bodyParser = require('body-parser');
const incomeRouter = require('./incomeRouter.js');
const expenseRouter = require('./expenseRouter.js');

module.exports = app => {
    app.use(bodyParser.json());
    app.use(incomeRouter);
    app.use(expenseRouter);
    app.get('/', (req, res, next) => {
        res.status(200).send({success: true});
    });
}