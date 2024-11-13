const express = require('express');
var homeRouter = express.Router();

homeRouter.get('/', (req, res) => {
    res.render('index', { title: 'Home' }); // Render the view index.ejs
});

module.exports = homeRouter;