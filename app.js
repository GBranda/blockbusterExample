const express = require('express')
const router = require('./routes/router')
const filmsRouter = require('./routes/filmsRouter')
const userRouter = require('./routes/userRouter')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/', router);
app.use('/films', filmsRouter);
app.use('/user', userRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})