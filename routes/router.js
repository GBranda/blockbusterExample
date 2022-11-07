const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const check = require('../middlewares/checks')
const errorHandler = require('../middlewares/errorHandler');


router.post('/register', userController.register)
router.get('/login', (req, res)=> res.send('Iniciar sesion'))
router.post('/login', userController.login)
router.get('/logout',check.checkLoggedIn, userController.logout)
router.use(errorHandler.errorLogger)

module.exports = router;