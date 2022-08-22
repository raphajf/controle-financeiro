const { Router } = require('express');
const MonthlyReviewController = require('../controllers/MonthlyReviewController.js');

const reviewRouter = Router();

reviewRouter.get('/resumo/:month/:year', MonthlyReviewController.listReview)

module.exports = reviewRouter;
