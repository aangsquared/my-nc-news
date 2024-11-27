const express = require("express")
const app = express()

const { getApi, getTopics } = require("./controllers/api.controller")

// error handlers
const {
  customErrorHandler,
  serverErrorHandler,
  psqlErrorHandler,
} = require("./db/error-handlers")

app.use(express.json())

app.get("/api", getApi)
app.get("/api/topics", getTopics)

app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app
