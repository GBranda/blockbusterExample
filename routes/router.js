const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const filmController = require('../controllers/filmController');
const userController = require('../controllers/userController');
const check = require('../middlewares/checks')
const errorHandler = require('../middlewares/errorHandler');
const rentController = require('../controllers/rentController')


router.use(bodyParser.json())
router.get('/films', filmController.getfilms);
router.get('/films/:id', filmController.getfilmDetails);
router.get('/runtime/:max', filmController.getfilmsByRuntime)
router.get('/favourites', check.checkLoggedIn, filmController.allFavouritesfilms)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/film', check.checkLoggedIn, filmController.addfilm)
router.post('/rent/:code', check.checkLoggedIn, rentController.rentFilm)
router.post('/favourite/:code', check.checkLoggedIn, filmController.addFavourite)
router.use(errorHandler.errorLogger)

module.exports = router;