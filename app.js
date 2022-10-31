const express = require('express')
const router = require('./routes/router')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/', router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})