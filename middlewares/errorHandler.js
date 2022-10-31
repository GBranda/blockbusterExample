const errorLogger = (error, req, res, next) => {
    console.error(error);
    next(error)
  }
  
  const errorParser = (error, req, res, next) => {
    if(error.status === 404) {
      res.status(404).send("Not found")
    } else if (error.status === 400 || error.errors.find(err => err.type === "notNull Violation")){
      res.status(400).send("BAD REQUEST")
    } else if (error.status === 401){
        res.status(401).send("UNAUTHORIZED")
    }else {
      res.status(500).send("Server ERROR")
    }
  }
  
  const errorHandler = {
    errorLogger,
    errorParser
  }
  
  module.exports = errorHandler;