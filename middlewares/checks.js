const jwt = require('jsonwebtoken')

const checkLoggedIn = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    let decoded = jwt.decode(token, {complete: true})
    if(!decoded) {
        const e = new Error("Not Logged In")
        next(e)
    }
    else {
        req.user = decoded.payload.usuario
        next()    
    }
}

const checkAdmin = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    let decoded = jwt.decode(token, {complete: true})
    if(!decoded || decoded.payload.usuario.isAdmin != true) {
        const e = new Error("Not authorized")
        next(e)
    }
    else {
        next()    
    }
}

module.exports = {
    checkAdmin,
    checkLoggedIn
}