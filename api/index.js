const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.status(200).send({success: true});
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = app;