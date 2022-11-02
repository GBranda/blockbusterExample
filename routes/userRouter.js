const express = require('express');
const userRouter = express.Router();
const filmController = require('../controllers/filmController');
const userController = require('../controllers/userController');
const check = require('../middlewares/checks')
const errorHandler = require('../middlewares/errorHandler');
const rentController = require('../controllers/rentController')


userRouter.get('/favourites', check.checkLoggedIn, filmController.allFavouritesfilms)
userRouter.get('/rented', check.checkLoggedIn, rentController.rentedFilmsByUser)
userRouter.post('/favourite/:code', check.checkLoggedIn, filmController.addFavourite)
userRouter.post('/rent/:code', check.checkLoggedIn, rentController.rentFilm)
userRouter.use(errorHandler.errorLogger)

module.exports = userRouter;