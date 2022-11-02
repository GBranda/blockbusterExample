const express = require('express');
const userRouter = express.Router();
const filmController = require('../controllers/filmController');
const userController = require('../controllers/userController');
const check = require('../middlewares/checks')
const errorHandler = require('../middlewares/errorHandler');
const rentController = require('../controllers/rentController')


userRouter.get('/favourites', check.checkLoggedIn, filmController.allFavouritesfilms)
userRouter.get('/rentHistory', check.checkLoggedIn, rentController.rentHistory)
userRouter.post('/favourite/:code', check.checkLoggedIn, filmController.addFavourite)
userRouter.post('/rent/:id', check.checkLoggedIn, rentController.rentFilm)
userRouter.post('/update/:id', check.checkAdmin, filmController.updateStock)
userRouter.use(errorHandler.errorLogger)

module.exports = userRouter;