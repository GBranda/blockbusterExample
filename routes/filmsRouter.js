const express = require('express');
const filmsRouter = express.Router();
const filmController = require('../controllers/filmController');
const userController = require('../controllers/userController');
const check = require('../middlewares/checks')
const errorHandler = require('../middlewares/errorHandler');
const rentController = require('../controllers/rentController')


filmsRouter.get('/', filmController.getfilms);
filmsRouter.get('/:id', filmController.getfilmDetails);
filmsRouter.get('/search/:name', filmController.getfilmsByName);
filmsRouter.put('/update/:filmId', check.checkAdmin, filmController.updateStock)
filmsRouter.delete('/delete/:filmId', check.checkAdmin, filmController.deleteFilm)
filmsRouter.use(errorHandler.errorLogger)

module.exports = filmsRouter;