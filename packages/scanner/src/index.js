const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, "..", "..", "..", ".env")
})

const express = require('express')
const app = express()

app.get("/hello-world", (req, res) => {
  return res.send("Hello world!")
})

app.listen(process.env.SCANNER_API_PORT, () => {
  console.log("Vultures scanner running")
})